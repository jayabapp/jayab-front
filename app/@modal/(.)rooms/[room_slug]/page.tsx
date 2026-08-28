import ModalClient from "./Modal.client";

const Page = async ({ params }: { params: Promise<{ room_slug: string }> }) => {
  const pageParams = await params;
  return <ModalClient params={pageParams} />;
};

export default Page;
