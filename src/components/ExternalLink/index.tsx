import React, { HTMLProps } from "react";
import { StyledLink } from "./external-link-styles";
import { anonymizeLink } from "../../utils/anonymizeLink";

const handleClickExternalLink = (
  event: React.MouseEvent<HTMLAnchorElement>
) => {
  const { target, href } = event.currentTarget;

  const anonymizedHref = anonymizeLink(href);

  // don't prevent default, don't redirect if it's a new tab
  if (target === "_blank" || event.ctrlKey || event.metaKey) {
    console.debug("Fired outbound link event", anonymizedHref);
  } else {
    event.preventDefault();
    window.location.href = anonymizedHref;
  }
};

export const ExternalLink = ({
  target = "_blank",
  href,
  rel = "noopener noreferrer",
  ...rest
}: Omit<HTMLProps<HTMLAnchorElement>, "as" | "ref" | "onClick"> & {
  href: string;
}) => {
  return (
    <StyledLink
      target={target}
      rel={rel}
      href={href}
      onClick={handleClickExternalLink}
      {...rest}
    />
  );
};
