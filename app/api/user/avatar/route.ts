import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/requireAuth";
import { put, del } from "@vercel/blob";
import crypto from "crypto";

// Allowed mime types
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];
// 5 MB max
const MAX_FILE_SIZE = 5 * 1024 * 1024;

export async function POST(req: NextRequest) {
  try {
    // 1. Verify authentication
    const authResult = await requireAuth(req);
    if (authResult instanceof NextResponse) {
      return authResult; // Unauthorized
    }
    const { user } = authResult;

    // 2. Read formData
    const formData = await req.formData();
    const file = formData.get("avatar") as File | null;

    if (!file) {
      return NextResponse.json({ success: false, message: "No file provided" }, { status: 400 });
    }

    // 3. Verify it's a file
    if (!(file instanceof File)) {
      return NextResponse.json({ success: false, message: "Invalid file data" }, { status: 400 });
    }

    // 4. Validate MIME type
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json({ success: false, message: "Unsupported file type. Use JPEG, PNG, or WebP." }, { status: 400 });
    }

    // 5. Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ success: false, message: "File exceeds 5MB limit" }, { status: 400 });
    }

    // 6. Generate collision-resistant unique filename
    const ext = file.name.split('.').pop()?.toLowerCase();
    const cleanExt = ["jpg", "jpeg", "png", "webp"].includes(ext || "") ? ext : "jpg";
    const uniqueFilename = `avatars/${user._id.toString()}-${crypto.randomBytes(8).toString('hex')}.${cleanExt}`;

    // 7. Save to Vercel Blob
    const blob = await put(uniqueFilename, file, {
      access: 'public',
      contentType: file.type,
    });

    // 8. Track old avatar for cleanup
    const oldAvatarUrl = user.avatar;

    // 9. Update database
    user.avatar = blob.url;
    await user.save();

    // 10. Clean up old remote avatar safely
    if (oldAvatarUrl && oldAvatarUrl.includes("public.blob.vercel-storage.com")) {
      try {
        await del(oldAvatarUrl);
      } catch (err) {
        console.error("Failed to delete old remote avatar:", oldAvatarUrl, err);
        // We don't fail the request if cleanup fails
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: "Avatar updated successfully",
      avatar: blob.url
    });

  } catch (error) {
    console.error("Error uploading avatar:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}
