import React from 'react';
import { CleanupUser } from '../../firebase/firebase_types';
import { getGeoJsonLineFromRoute } from './geoJsonHelper';
import WalkPath from './walkPath';

interface WalkPathsCleanupProps {
  cleanupUsers: CleanupUser[] | undefined;
}

function WalkPathsCleanup(props: WalkPathsCleanupProps) {
  return (
    <>
      {props.cleanupUsers?.map(
        ({ uid, route }) =>
          route && (
            <div key={uid}>
              <WalkPath uid={uid} walkPath={getGeoJsonLineFromRoute(route)} />
            </div>
          )
      )}
    </>
  );
}

export default WalkPathsCleanup;
