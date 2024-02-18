import { load } from "cheerio";

const customIndex = ({
  htmlStr,
  indexTitle,
  matchedColor,
}: {
  htmlStr: string;
  indexTitle?: string;
  matchedColor: string;
}) => {
  const $ = load(htmlStr);
  const existingStyle = $("style").html();

  const newCssRule = `
    .hover-effect {
      transition: color 0.1s linear;
    }
    .hover-effect:hover {
      color: ${matchedColor};
    }
    @media (max-width: 1029px) {
      nav { display: none !important; }
    }
  `;

  $("html").css("scroll-behavior", "smooth");
  $("style").text(`${existingStyle}\n${newCssRule}`);
  $("body")
    .css("max-width", "1000px")
    .css("display", "flex")
    .css("position", "relative")
    .css("padding", "0 20px")
    .css("box-sizing", "content-box");

  $("article")
    .css("width", "100%")
    .css("height", "fit-content")
    .css("display", "flex")
    .css("flex-direction", "column")
    .css("position", "relative");

  $("nav")
    .insertBefore("body")
    .css("position", "sticky")
    .css("top", "2em")
    .css("padding", "0 0 0 40px")
    .css("min-width", "224px")
    .css("width", "fit-content")
    .css("height", "fit-content")
    .css("display", "flex")
    .css("flex-direction", "column")
    .css("align-items", "flex-start")
    .css("gap", "5px")
    .css("order", "2");
  $("nav > div")
    .css("display", "flex")
    .css("width", "fit-content")
    .css("height", "fit-content")
    .css("border", "none");
  $("nav > div > a")
    .css("font-size", "1em")
    .css("border", "none")
    .addClass("hover-effect");

  if (indexTitle) {
    $("nav").prepend(
      `<div style="font-weight: 600; margin-bottom: 5px; color: #00000066;">${indexTitle}</div>`
    );
  }

  $("body").append(`<script>
    let ticking = false;
    const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'));
    const nav = document.querySelector('nav');
    const navLinks = document.querySelectorAll('nav > div > a');

    function updateActiveNavLink() {
      if(!nav) return;

      let closestHeadingAboveScreenTop = null;
      const padding = 100;

      headings.forEach((heading) => {
        const distanceFromTop = heading.getBoundingClientRect().top - padding;
        if (distanceFromTop < 0 && (!closestHeadingAboveScreenTop || distanceFromTop > closestHeadingAboveScreenTop.getBoundingClientRect().top)) {
          closestHeadingAboveScreenTop = heading;
        }
      });
  
      navLinks.forEach((link) => {
        link.style.color = '';
      });
  
      if (closestHeadingAboveScreenTop) {
        navLinks.forEach((link) => {
          if (link.getAttribute('href') === '#' + closestHeadingAboveScreenTop.id) {
            link.style.color = '${matchedColor}';
          }
        });
      }
    }

    function initHandler() {
      if(!nav) return;

      const currentHash = window.location.hash;

      document.querySelectorAll('a').forEach(function(link) {
        const linkHash = link.getAttribute('href');

        if (linkHash === currentHash) {
          link.style.color = '${matchedColor}';
        }
      });
    }

    document.addEventListener('DOMContentLoaded', initHandler);

    document.addEventListener('scroll', function(e) {
      if (!ticking) {
        window.requestAnimationFrame(function() {
          updateActiveNavLink();
          ticking = false;
        });

        ticking = true;
      }
    });
  </script>`);

  return $.html();
};

const changeTitle = ({ htmlStr }: { htmlStr: string }) => {
  const $ = load(htmlStr);

  const viewTitle = $(".page-body > p").first().text();
  $(".page-body > p").first().remove();

  $("header > h1").text(viewTitle);

  return $.html();
};

const customCoverImage = ({ htmlStr }: { htmlStr: string }) => {
  const $ = load(htmlStr);

  $("header > img")
    .css("max-height", "40vh")
    .css("border-radius", "8px")
    .css("border", "1px solid #00000008");

  return $.html();
};

const removeImgAnchor = ({ htmlStr }: { htmlStr: string }) => {
  const $ = load(htmlStr);

  $("figure").each(function () {
    const $figure = $(this);
    const $a = $figure.find("figure > a");

    $a.each(function () {
      const $img = $(this).find("img");
      $(this).before($img);
      $(this).remove();
    });
  });

  return $.html();
};

export const parser = ({
  originHtmlStr,
  indexTitle,
  matchedColor = "rgb(0, 0, 0)",
}: {
  originHtmlStr: string;
  indexTitle?: string;
  matchedColor?: string;
}) => {
  let htmlStr: string;

  htmlStr = customIndex({
    htmlStr: originHtmlStr,
    indexTitle,
    matchedColor,
  });
  htmlStr = changeTitle({ htmlStr });
  htmlStr = customCoverImage({ htmlStr });
  htmlStr = removeImgAnchor({ htmlStr });

  return htmlStr;
};
