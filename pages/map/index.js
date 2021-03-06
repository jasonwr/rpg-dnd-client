import {useRouter} from 'next/router'
import * as React from "react";
import {context, useRpgContext} from "../../context/providers";
import {MapImage} from "../../components";

export default function Map() {
  const router = useRouter()
  let {state} = useRpgContext()

  React.useEffect(() => {
    if (!state.isLoggedIn) {
      router.push('/', undefined, {shallow: true})
     }
  })

  return (
    <div>
      <MapImage title="The Shire"/>
    </div>
  );
}
