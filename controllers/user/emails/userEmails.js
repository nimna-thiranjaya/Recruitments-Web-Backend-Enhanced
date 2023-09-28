const AccountConfirmationEmail = (firstName, confirmUrl) => {
  return ` <div
    style="font-family: Roboto; background: white; overflow: hidden; margin-top:-100px"
  >
    <div
      style="
        position: relative;
        margin: 0px auto;
        width: 80%;
        max-width: 400px;
        padding: 20px;
        box-shadow: 3px 10px 20px rgba(0, 0, 0, 0.2);
        border-radius: 3px;
        border: 0;
      "
    >
      <div>
        <div>
        <h2
          style="
            text-align: center;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            letter-spacing: 0.6px;
            font-weight: 300;
          "
        >
       Hey ${firstName}! <br/> Welcome to Recruitement Website
        </h2>
        </div>
      </div>
      <div
        style="
          margin-top: 25px;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
        "
      >
        <img
          style="width: 100%;
          display: flex;
          justify-content: center;"
          src="https://res.cloudinary.com/desnqqj6a/image/upload/v1657722063/Sign_up-bro_rjte42.png"
          alt=""
        />
      </div>
      <div
        style="
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
        "
      >
        <div>
          <h2
            style="
              text-align: center;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 18px;
              letter-spacing: 0.5px;
              font-weight: 300;
            "
          >
            Please click on the link below to activate your account.
          </h2>
          <a href=${confirmUrl}>
            <button
              style="
                width: 100%;
                padding: 8px;
                border-radius: 30px;
                border: 0;
                background: #17bf9e;
                color: #fff;
                margin-top: 20px;
              "
            >
              Activate Account
            </button>
          </a>
        </div>
      </div>
    </center>
  </div>`;
};

module.exports = { AccountConfirmationEmail };
