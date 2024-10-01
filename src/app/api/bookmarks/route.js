import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// Centralized error handling
const handleError = (error, message = "An error occurred") => {
  console.error(message, error);
  return NextResponse.json({ error: message }, { status: 500 });
};

// Validate bookmark data
const validateBookmarkData = (data) => {
  const { userId, movieId, tvSeriesId } = data;
  if (!userId || (!movieId && !tvSeriesId)) {
    return "Missing required fields: userId and either movieId or tvSeriesId";
  }
  return null;
};

// Get all bookmarks for a user
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "Missing user ID" }, { status: 400 });
  }

  try {
    const bookmarks = await prisma.bookmark.findMany({
      where: { userId },
      include: {
        movie: true,
        tvSeries: true,
      },
    });
    return NextResponse.json({
      message: "Bookmarks fetched successfully",
      bookmarks,
    });
  } catch (error) {
    return handleError(error, "Failed to fetch bookmarks");
  }
}

// Create a new bookmark
export async function POST(request) {
  try {
    const data = await request.json();
    const validationError = validateBookmarkData(data);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const bookmark = await prisma.bookmark.create({
      data,
    });

    return NextResponse.json(
      { message: "Bookmark created successfully", bookmark },
      { status: 201 }
    );
  } catch (error) {
    return handleError(error, "Failed to create bookmark");
  }
}

// Delete bookmark by ID
export async function DELETE(request) {
  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: "Missing bookmark ID" },
        { status: 400 }
      );
    }

    const bookmark = await prisma.bookmark.delete({
      where: { id },
    });

    return NextResponse.json({
      message: "Bookmark deleted successfully",
      bookmark,
    });
  } catch (error) {
    console.error("Error deleting bookmark:", error);
    return handleError(error, "Failed to delete bookmark");
  }
}
