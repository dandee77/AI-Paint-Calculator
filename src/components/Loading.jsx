import { InfinitySpin } from "react-loader-spinner";

export default function Loading() {
  return (
    <div className="flex justify-center items-center h-screen">
      <InfinitySpin
        visible={true}
        width="200"
        color="#616161"
        ariaLabel="infinity-spin-loading"
      />
    </div>
  );
}
