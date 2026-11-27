
import {
  connection,
  NextRequest,
  NextResponse,
} from "next/server";

import { searchProducts } from "@/services/product.service";

export async function GET(request: NextRequest) {
  // Wait for an actual incoming request before accessing request data.
  await connection();

  try {
    const query = request.nextUrl.searchParams.get("q")?.trim() ?? "";

    if (!query) {
      return NextResponse.json({
        success: true,
        products: [],
        count: 0,
      });
    }

    if (query.length > 100) {
      return NextResponse.json(
        {
          success: false,
          message: "Search query is too long.",
        },
        { status: 400 }
      );
    }

    const products = await searchProducts(query, 8);

    return NextResponse.json({
      success: true,
      products,
      count: products.length,
    });
  } catch (error) {
    console.error("Product search error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to search products.",
      },
      { status: 500 }
    );
  }
}
