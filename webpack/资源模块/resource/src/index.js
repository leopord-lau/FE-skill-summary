import "./index.html";
import webpack from "../images/webpack.png";
import webpackLogo from "../images/webpack-logo.png";
import webpackLogoSvg from "../images/webpack-logo.svg";

function createImage(pic) {
  const image = document.createElement("img");
  image.src = pic;
  return image;
}
document.body.appendChild(createImage(webpackLogoSvg));
document.body.appendChild(createImage(webpackLogo));
document.body.appendChild(createImage(webpack));
