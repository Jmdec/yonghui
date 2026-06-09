import { NextRequest, NextResponse } from "next/server";
import QRCode from "qrcode";

/**
 * POST /api/qrcode
 * Generate a QR code as a data URL or PNG file
 *
 * Request body:
 * {
 *   value: string,
 *   format?: "dataUrl" | "png"
 * }
 */
export async function POST(req: NextRequest) {
  try {
    const { value, format = "dataUrl" } = await req.json();

    if (!value || typeof value !== "string") {
      return NextResponse.json(
        {
          success: false,
          message: "Activation code (value) is required.",
        },
        { status: 400 },
      );
    }

    if (format === "png") {
      const pngBuffer = await QRCode.toBuffer(value, {
        errorCorrectionLevel: "H",
        width: 300,
        margin: 2,
      });

      return new NextResponse(new Uint8Array(pngBuffer), {
        status: 200,
        headers: {
          "Content-Type": "image/png",
          "Content-Disposition": `attachment; filename="qrcode-${Date.now()}.png"`,
          "Cache-Control": "no-store",
        },
      });
    }

    const dataUrl = await QRCode.toDataURL(value, {
      errorCorrectionLevel: "H",
      width: 300,
      margin: 2,
    });

    return NextResponse.json({
      success: true,
      value,
      qrCode: dataUrl,
    });
  } catch (error) {
    console.error("[qrcode] Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to generate QR code.",
      },
      { status: 500 },
    );
  }
}
