import EditorPage from "./EditorPage";
import { createDocumentRoute } from "./params";

const { generateMetadata, Page } = createDocumentRoute(EditorPage, "Edit");
export { generateMetadata };
export default Page;
export const dynamic = "force-dynamic";
