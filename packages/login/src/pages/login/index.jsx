import React, { Suspense, useRef, useEffect } from 'react';


const AUTHING_WIDTH = { width: 456 };


function AuthingContainer() {
  const didInitialise = useRef(false);
  
  useEffect(() => {
    if (didInitialise.current) {
      return;
    }
    didInitialise.current = true;

    const head = window.head;
    head.bridge.initialize([ 'cn.authing.guard' ]).then(([ guard ]) => {
      guard.start('#js-authing-container');
      guard.on('login', (session) => {
        const { id, arn, token, username, email } = session;
        localStorage.setItem('x-authn', token);
        window.location.href = '/workspace';
      });
    });
  }, []);

  return <div id="js-authing-container" className="ml-auto mr-auto" style={AUTHING_WIDTH} />;
}

export default function Index() {
  return (
    <Suspense>
      <AuthingContainer />
    </Suspense>
  );
}
