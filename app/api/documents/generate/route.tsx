import { NextRequest, NextResponse } from "next/server";
import { renderToStream } from "@react-pdf/renderer";
import { QuoteInvoicePDF } from "@/components/documents/QuoteInvoiceTemplate";
import { DeliveryNotePDF } from "@/components/documents/DeliveryNoteTemplate";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body || !body.docType) {
      return NextResponse.json(
        { message: "Document type is required." },
        { status: 400 }
      );
    }

    let documentComponent;

    // Choose the component based on the docType from the form
    if (body.docType === "invoice" || body.docType === "quotation") {
      documentComponent = <QuoteInvoicePDF data={body} />;
    } else if (body.docType === "delivery") {
      documentComponent = <DeliveryNotePDF data={body} />;
    } else {
      return NextResponse.json(
        { message: "Invalid document type." },
        { status: 400 }
      );
    }

  const pdfStream = await renderToStream(documentComponent);

  const response = new NextResponse(pdfStream as unknown as BodyInit);

    response.headers.set("Content-Type", "application/pdf");
    response.headers.set(
      "Content-Disposition",
      `attachment; filename="${body.docType}.pdf"`
    );

    return response;
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: err instanceof Error ? err.message : "Server error" },
      { status: 500 }
    );
  }
}
