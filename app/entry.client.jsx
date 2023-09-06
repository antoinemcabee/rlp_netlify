import {RemixBrowser} from '@remix-run/react';
import {startTransition, StrictMode} from 'react';
import {hydrateRoot} from 'react-dom/client';
import { AnimatePresence } from 'framer-motion';
startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <AnimatePresence mode='wait'>
        <RemixBrowser />
      </AnimatePresence>
    </StrictMode>,
  );
});
