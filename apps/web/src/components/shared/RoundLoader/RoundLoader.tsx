import Image from "next/image";
import styles from "./RoundLoader.module.css";

// Full-page loader: the logo inside four spinning coloured rings.
const RoundLoader = () => {
  return (
    <div className={styles.root} role="status" aria-label="Loading">
      <div className={styles.box}>
        <div className={styles.ring} />
        <div className={styles.ring} />
        <div className={styles.ring} />
        <div className={styles.ring} />
        <Image
          src="/images/logo/no-tension-logo.jpg"
          alt=""
          width={1600}
          height={900}
          sizes="162px"
          className={`${styles.logo} h-auto w-full`}
        />
      </div>
    </div>
  );
};

export default RoundLoader;
