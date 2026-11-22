import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import store from "@/redux/store";
import { legacyAwareStorage } from "./storage";
import { logout } from "./logout";
import {
  initialSessionState,
  sessionFromLegacy,
  useSessionStore,
  type UserLocation,
} from "./sessionStore";

function fakeStorage(seed: Record<string, string> = {}): Storage {
  const map = new Map(Object.entries(seed));
  return {
    get length() {
      return map.size;
    },
    clear: () => map.clear(),
    getItem: (k) => map.get(k) ?? null,
    key: (i) => [...map.keys()][i] ?? null,
    removeItem: (k) => void map.delete(k),
    setItem: (k, v) => void map.set(k, String(v)),
  };
}

async function useStorage(fake: Storage) {
  useSessionStore.persist.setOptions({
    storage: legacyAwareStorage("notension-session", 1, sessionFromLegacy, fake),
  });
  await useSessionStore.persist.rehydrate();
}

const legacyRoot = (user: unknown) =>
  JSON.stringify({ user: JSON.stringify(user), _persist: '{"version":1}' });

const loc: UserLocation = {
  userLatitude: "23.7",
  userLongitude: "90.4",
  districtId: "5",
  districtName: "Dhaka",
  address: "Road 1",
};
const get = () => useSessionStore.getState();

beforeEach(async () => {
  await useStorage(fakeStorage());
  useSessionStore.setState(initialSessionState);
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("session store", () => {
  it("saveLocation derives lat/lng/district, \"00\" when missing", () => {
    get().saveLocation(loc);
    expect(get().currentUserLocation).toEqual(loc);
    expect(get().userLatitude).toBe("23.7");
    expect(get().userLongitude).toBe("90.4");
    expect(get().districtId).toBe("5");

    get().saveLocation({ districtName: "X" } as UserLocation);
    expect(get().userLatitude).toBe("00");
    expect(get().userLongitude).toBe("00");
    expect(get().districtId).toBe("00");
  });

  it("clearAccount keeps location and delivery address", () => {
    useSessionStore.setState({ deliveryAddress: "House 2" });
    get().saveLocation(loc);
    get().login({ name: "A" });
    expect(get().isLoggedin).toBe(true);
    get().clearAccount();
    expect(get().isLoggedin).toBe(false);
    expect(get().userInfo).toEqual({});
    expect(get().currentUserLocation).toEqual(loc);
    expect(get().districtId).toBe("5");
    expect(get().deliveryAddress).toBe("House 2");
  });

  it("migrates a logged-in legacy user", async () => {
    const user = {
      isLoggedin: true,
      userInfo: { name: "A" },
      districtId: "1",
      currentUserLocation: loc,
      userLatitude: "23.7",
      userLongitude: "90.4",
      deliveryAddress: "House 2",
      orders: [],
    };
    await useStorage(fakeStorage({ "persist:root": legacyRoot(user) }));
    expect(get().isLoggedin).toBe(true);
    expect(get().userInfo).toEqual({ name: "A" });
    expect(get().districtId).toBe("1");
    expect(get().currentUserLocation).toEqual(loc);
    expect(get().userLatitude).toBe("23.7");
    expect(get().userLongitude).toBe("90.4");
    expect(get().deliveryAddress).toBe("House 2");
  });

  it("sessionFromLegacy ignores wrong-typed fields and missing data", () => {
    expect(sessionFromLegacy(fakeStorage())).toBeNull();
    expect(
      sessionFromLegacy(fakeStorage({ "persist:root": JSON.stringify({}) })),
    ).toBeNull();
    const s = sessionFromLegacy(
      fakeStorage({
        "persist:root": legacyRoot({
          isLoggedin: "yes",
          userInfo: [1],
          districtId: 7,
          userLatitude: "10",
        }),
      }),
    );
    expect(s).toEqual({ ...initialSessionState, userLatitude: "10" });
  });
});

describe("logout", () => {
  it("clears session and dispatches LOGOUT_USER", () => {
    const spy = vi.spyOn(store, "dispatch");
    get().saveLocation(loc);
    get().login({ name: "A" });
    logout();
    expect(get().isLoggedin).toBe(false);
    expect(get().currentUserLocation).toEqual(loc);
    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({
        payload: { type: "LOGOUT_USER" },
      }),
    );
  });
});
