import { Player } from "@lottiefiles/react-lottie-player";
import detectiveAnimation from "../assets/detective.json";
import "./ErrorPage.css";

export function showErrorPage(typeOfError) {
  let errorData;

  switch (typeOfError?.trim()) {
    case "USER_NOT_FOUND":
      errorData = {
        title: "Uh-oh... this user vanished! 🕵️",
        message:
          "Our detective searched everywhere, but couldn't find this person.",
      };
      break;

    case "GROUP_NOT_FOUND":
      errorData = {
        title: "This group is hiding from us! 🫣",
        message:
          "Our detective searched high and low, but this group seems to have disappeared.",
      };
      break;

    default:
      errorData = {
        title: "Hmm... something went wrong 🤔",
        message:
          "Our little detective is investigating the situation.",
      };
  }

  return (
    <div className="error-page">

      <div className="error-content">

        <div className="error-code">
          404
        </div>

        <h1>
          {errorData.title}
        </h1>

        <p>
          {errorData.message}
        </p>

        <button
          className="back-button"
          onClick={() => window.history.back()}
        >
          ← Go Back
        </button>

      </div>

      <div className="detective-track">

        <div className="detective-wrapper">

          <Player
            autoplay
            loop
            src={detectiveAnimation}
            className="detective-animation"
          />

          <div className="searching-label">
            Searching...
          </div>

        </div>

      </div>

    </div>
  );
}