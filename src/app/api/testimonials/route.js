import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// Centralized error handling
const handleError = (error, message = "An error occurred") => {
  console.error(message, error);
  return NextResponse.json({ error: message }, { status: 500 });
};

// Validate testimonial data
const validateTestimonialData = (data) => {
  const { userId, avatar, rating, remark } = data;
  if (!userId || !avatar || rating === undefined || !remark) {
    return "Missing required fields: userId, avatar, rating, remark";
  }
  if (typeof rating !== "number" || rating < 0 || rating > 5) {
    return "Rating must be a number between 0 and 5";
  }
  return null;
};

// Get all testimonials
export async function GET() {
  try {
    const testimonials = await prisma.testimonials.findMany();
    return NextResponse.json({
      message: "Testimonials fetched successfully",
      testimonials,
    });
  } catch (error) {
    return handleError(error, "Failed to fetch testimonials");
  }
}

// Create a new testimonial
export async function POST(request) {
  try {
    const data = await request.json();
    const validationError = validateTestimonialData(data);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const testimonial = await prisma.testimonials.create({
      data,
    });

    return NextResponse.json(
      { message: "Testimonial created successfully", testimonial },
      { status: 201 }
    );
  } catch (error) {
    return handleError(error, "Failed to create testimonial");
  }
}

// Delete testimonial by ID
export async function DELETE(request) {
  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: "Missing testimonial ID" },
        { status: 400 }
      );
    }

    const testimonial = await prisma.testimonials.delete({
      where: { id },
    });

    return NextResponse.json({
      message: "Testimonial deleted successfully",
      testimonial,
    });
  } catch (error) {
    console.error("Error deleting testimonial:", error);
    return handleError(error, "Failed to delete testimonial");
  }
}
