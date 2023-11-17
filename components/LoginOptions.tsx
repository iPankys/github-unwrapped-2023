import React, { useCallback, useMemo } from "react";
import buttonStyles from "../components/Button/styles.module.css";
import {
  frontendCredentials,
  makeRedirectUriFrontend,
} from "../helpers/domain";
import { Button } from "./Button/Button";
import { Input } from "./Input/Input";
import styles from "./styles.module.css";

type Props = {
  userNotFound: boolean;
  setUserNotFound: React.Dispatch<React.SetStateAction<boolean>>;
  username: string;
  setUsername: React.Dispatch<React.SetStateAction<string>>;
};

export const LoginOptions: React.FC<Props> = ({
  username,
  setUsername,
  userNotFound,
  setUserNotFound,
}) => {
  const handleClick: React.FormEventHandler<HTMLFormElement> = useCallback(
    (e) => {
      e.preventDefault();
      fetch(`https://api.github.com/users/${username}`)
        .then((response) => response.json())
        .then((result) => {
          if (result.message === "Not Found") {
            setUserNotFound(true);
          } else {
            setUserNotFound(false);
            window.location.href = "/" + username;
          }
        })
        .catch((error) => console.log("error", error));
    },
    [setUserNotFound, username]
  );

  const href = useMemo(() => {
    const params = new URLSearchParams();
    params.append("redirect_uri", makeRedirectUriFrontend());
    params.append("client_id", frontendCredentials().VITE_CLIENT_ID);
    params.append("scope", "user");

    const url = new URL("https://github.com/login/oauth/authorize");
    url.search = params.toString();

    return url.toString();
  }, []);

  return (
    <div className={styles.inputContainer}>
      <form className={styles.buttonContainer} onSubmit={handleClick}>
        <Input
          text={username}
          placeHolder="Username"
          setText={(s) => setUsername(s)}
          invalid={userNotFound}
          style={{
            borderRadius: "5px 0 0 5px",
            width: 250,
            fontWeight: "bold",
          }}
          className={styles.input}
        />
        <Button
          className={styles.button}
          style={{ borderRadius: "0 5px 5px 0" }}
        >
          Start Unwrapped
        </Button>
      </form>

      <div>or</div>
      <a
        style={{ textDecoration: "none" }}
        className={buttonStyles.secondarybutton}
        href={href}
      >
        Sign in with GitHub
      </a>
    </div>
  );
};
