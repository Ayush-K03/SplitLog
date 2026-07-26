import { Player } from "@lottiefiles/react-lottie-player";
import detectiveAnimation from "../assets/detective.json";
import "./ErrorPage.css";

export function ErrorPage({ typeOfError, statusCode = 404 }) {
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

    case "SERVER_ERROR":
      errorData = {
        title: "Whoops! Server broke a sweat 🔧",
        message:
          "Our detective is looking into the server logs to see what tripped us up.",
      };
      statusCode = statusCode === 404 ? 500 : statusCode;
      break;

    case "NOT_FOUND":
      errorData = {
        title: "This page doesn't exist! 🗺️",
        message:
          "You've wandered off the map. Our detective can't find what you're looking for.",
      };
      statusCode = 404;
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
          {statusCode}
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