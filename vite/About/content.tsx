import { signInWithGitHubLink } from "../sign-in-with-github";
import { default as styles } from "../styles.module.css";
import { EmailForm } from "./EmailForm";

export type AboutItemContent = {
  icon: string;
  title: string;
  description?: string;
  node?: React.ReactNode;
};

export const content: Array<AboutItemContent> = [
  {
    icon: "/book.svg",
    title: "How it works",
    description: `We call GitHub's GraphQL API to fetch and calculate your statistics.The data cutoff is approximately 24 hours before you generated the video.The video gets created using Remotion.`,
  },
  {
    icon: "/detective.svg",
    title: "Who is behind GitHub Unwrapped?",
    description: "",
    node: (
      <p style={{ marginTop: -32 }}>
        The project was implemented by{" "}
        <a className={styles.aboutLink} href="https://www.remotion.dev">
          Remotion
        </a>{" "}
        in collaboration with{" "}
        <a className={styles.aboutLink} href="https://www.foronered.com">
          For One Red
        </a>
        {", "}
        who also made all the design for this project.
      </p>
    ),
  },
  {
    icon: "/eyeball.svg",
    title: "Private contributions not showing up?",
    description: `To enable private contributions, you need to enable "Include private contributions on my profile" in your GitHub settings. Once you've done this, login in again and regenerate your video.`,
    node: (
      <a
        className={styles.aboutButton}
        style={{ lineHeight: "43px" }}
        href={signInWithGitHubLink()}
      >
        Login again
      </a>
    ),
  },
  {
    icon: "/open-source.svg",
    title: "Is this project open source?",
    description: `We call GitHub's GraphQL API to fetch and calculate your statistics.The data cutoff is approximately 24 hours before you generated the video.The video gets created using Remotion.`,
  },
  {
    icon: "/calculator.svg",
    title: "How are my top languages calculated?",
    description: `Your top languages are not exactly calculated in a scientific way but are estimated according to the following formula:
      The list of repositories that you contributed to are fetched. A ranking is assigned to the top 3 languages (top language = 3 points, second = 2 points, third = 1 point) and they are multiplied by the contribution count and the amount of lines of that language in that repository.`,
  },
  {
    icon: "/chat.svg",
    title: "Want to host a year in review for your users?",
    description: ``,
    node: (
      <>
        <p style={{ marginTop: -32 }}>
          Want to give your users their personalized video at the end of 2024?
          <br />
          <br />
          Developers: Check out{" "}
          <a className={styles.aboutLink} href="https://www.remotion.dev">
            Remotion
          </a>{" "}
          and the source code of{" "}
          <a
            className={styles.aboutLink}
            href="https://github.com/remotion-dev/github-unwrapped-2023"
          >
            this project
          </a>
          !<br />
          <br /> Non-developers: Drop your email and we\&aposll contact you in
          September 2024 for a free consultation!
        </p>
        <EmailForm />
      </>
    ),
  },
  {
    icon: "/trophy.svg",
    title: "Credits",
    node: (
      <p style={{ marginTop: -32 }}>
        Music -{" "}
        <a
          className={styles.aboutLink}
          href="https://audiojungle.net/item/robots/35287595"
        >
          Robots
        </a>{" "}
        by Nicolas T. <br />
        Design -{" "}
        <a className={styles.aboutLink} href="https://www.foronered.com/">
          For One Red{" "}
        </a>{" "}
        <br />
        Font -{" "}
        <a
          className={styles.aboutLink}
          href="https://github.com/github/mona-sans"
        >
          Mona Sans{" "}
        </a>{" "}
        by GitHub <br />
        <br />
      </p>
    ),
  },
  {
    icon: "/mail.svg",
    title: "Contact",
    description: ``,
    node: (
      <a
        target="_blank"
        href="mailto:hi@remotion.dev"
        rel="noreferrer"
        className={styles.aboutButton}
        style={{ lineHeight: "43px", marginTop: -16 }}
      >
        hi@remotion.dev
      </a>
    ),
  },
];
