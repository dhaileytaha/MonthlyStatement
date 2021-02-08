import { faCheck, faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
import { faCopy } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useCallback, useState } from 'react';
import { OverlayTrigger, Popover } from 'react-bootstrap';
import copy from 'copy-to-clipboard';
import { ExternalLink } from './ExternalLink';

interface TxProps {
  hash: string;
}

export const Tx = ({ hash }: TxProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    setCopied(true);
    copy(hash);
    setTimeout(() => {
      setCopied(false);
    }, 1000);
  }, [hash]);

  return (
    <span>
      <OverlayTrigger
        delay={250}
        placement="bottom"
        overlay={
          <Popover id="hash">
            <Popover.Content>{hash}</Popover.Content>
          </Popover>
        }
      >
        <span title={hash}>
          {hash.substr(0, 7)}...{hash.substr(-3, 5)}{' '}
          <ExternalLink
            href={`https://etherscan.io/tx/${hash}`}
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
