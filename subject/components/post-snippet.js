import Link from "next/link";
import styles from "./post-snippet.module.css";

export default function Snippet({title, author, created, duration, path}){
  return (
    <div className={styles.snippetDiv}>
      <div>
        <Link href={"/post/"+path}>{title}</Link>
      </div>
      <div className={styles.metadata}>
        <span>{author}</span>
        <span className={styles.sep}>&#9899;</span>
        <span>{created}</span>
        <span className={styles.sep}>&#9899;</span>
        <span>{duration}</span>
      </div>
    </div>
  );
}