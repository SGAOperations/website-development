import PreviewPage from "../../PreviewPage";
import { createDocumentRoute } from "../../params";

const { generateMetadata, Page } = createDocumentRoute(PreviewPage, "Preview");
export { generateMetadata };
export default Page;
export const dynamic = "force-dynamic";
