// Import necessary libraries
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";

// Centralized error handling
const handleError = (error, message = "An error occurred") => {
  console.error(message, error);
  return NextResponse.json({ error: message }, { status: 500 });
};

// Validate bookmark data
const validateBookmarkData = (data) => {
  const { movieId, seriesId } = data;
  if (!movieId && !seriesId) {
    return "Either movieId or seriesId must be provided";
  }
  return null;
};

// Validate ObjectId format (24 hex characters)
const isValidObjectId = (id) => {
  return /^[a-fA-F0-9]{24}$/.test(id);
};

// Get all bookmarks for the authenticated user
export async function GET(request) {
  try {
    console.log("GET request for bookmarks received");
    const { userId } = getAuth(request); // Get user ID from Clerk

    if (!userId) {
      console.log("Unauthorized: no user ID");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const bookmarks = await prisma.bookmark.findMany({
      where: { userId }, // Use userId directly
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
    console.log("POST request for bookmark creation received");
    const { userId } = getAuth(request); // Get user ID from Clerk

    if (!userId) {
      console.log("Unauthorized: no user ID");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();
    const validationError = validateBookmarkData(data);
    if (validationError) {
      console.log(`Validation error: ${validationError}`);
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const bookmark = await prisma.bookmark.create({
      data: {
        userId, // Use userId directly
        movieId: data.movieId || null,
        seriesId: data.seriesId || null,
      },
    });

    console.log("Bookmark created:", bookmark);
    return NextResponse.json(
      { message: "Bookmark created successfully", bookmark },
      { status: 201 }
    );
  } catch (error) {
    return handleError(error, "Failed to create bookmark");
  }
}

// Delete a bookmark by ID
export async function DELETE(request) {
  try {
    console.log("DELETE request for bookmark received");
    const { userId } = getAuth(request); // Get user ID from Clerk

    if (!userId) {
      console.log("Unauthorized: no user ID");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await request.json();

    if (!id) {
      console.log("Missing bookmark ID");
      return NextResponse.json({ error: "Missing bookmark ID" }, { status: 400 });
    }

    // Validate the ObjectId format
    if (!isValidObjectId(id)) {
      console.log("Invalid bookmark ID format");
      return NextResponse.json({ error: "Invalid bookmark ID format" }, { status: 400 });
    }

    await prisma.bookmark.deleteMany({
      where: {
        id: String(id),
        userId, // Use userId directly
      },
    });

    console.log("Bookmark deleted:", id);
    return NextResponse.json({
      message: "Bookmark deleted successfully",
    });
  } catch (error) {
    return handleError(error, "Failed to delete bookmark");
  }
}
