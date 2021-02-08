import { faCheck, faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
import { faCopy } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useCallback, useState } from 'react';
import { OverlayTrigger, Popover } from 'react-bootstrap';
import copy from 'copy-to-clipboard';
import { ExternalLink } from './ExternalLink';

interface AddressProps {
  address: string;
}

export const Address = ({ address }: AddressProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    setCopied(true);
    copy(address);
    setTimeout(() => {
      setCopied(false);
    }, 1000);
  }, [address]);

  return (
    <span>
      <OverlayTrigger
        delay={250}
        placement="bottom"
        overlay={
          <Popover id="hash">
            <Popover.Content>{address}</Popover.Content>
          </Popover>
        }
      >
        <span title={address}>
          {address.substr(0, 7)}...{address.substr(-5, 3)}{' '}
          <ExternalLink
            href={`https://etherscan.io/address/${address}`}
            style={{
              color: 'currentColor',
              marginLeft: 4,
            }}
          >
            <FontAwesomeIcon icon={faExternalLinkAlt} />
          </ExternalLink>{' '}
          <button
            onClick={handleCopy}
            style={{
              border: 0,
              background: 'none',
            }}
          >
            <FontAwesomeIcon icon={copied ? faCheck : faCopy} />
          </button>
        </span>
      </OverlayTrigger>
    </span>
  );
};
