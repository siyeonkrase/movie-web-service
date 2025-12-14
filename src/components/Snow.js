import styles from "./cssModule/Snow.module.css";

export default function Snow() {
  const count = 55; // 원하면 70까지 올려도 됨

  return (
    <div className={styles.snow}>
      {Array.from({ length: count }).map((_, i) => {
        const size = 4 + Math.random() * 18;
        const blur = Math.random() * 2.2;
        const dur = 7 + Math.random() * 10;
        const drift = 6 + Math.random() * 18;
        const driftDur = 2.8 + Math.random() * 2.8;
        const opacity = 0.35 + Math.random() * 0.55;

        return (
          <span
            key={i}
            style={{
              left: `${Math.random() * 100}vw`,
              width: `${size}px`,
              height: `${size}px`,
              opacity,
              "--blur": `${blur}px`,
              "--dur": `${dur}s`,
              "--drift": `${drift}px`,
              "--driftDur": `${driftDur}s`,
              animationDelay: `${-Math.random() * dur}s`,
            }}
          />
        );
      })}
    </div>
  );
}
