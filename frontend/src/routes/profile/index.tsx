import { createFileRoute } from "@tanstack/react-router";
import React, { useState } from "react";
import ProtectedRoute from "../../components/ProtectedRoute";
import useAuth from "../../hooks/useAuth";
import toast from "react-hot-toast";
import useUpdateUserProfile from "../../hooks/queryMutations/useUpdateUserProfile";

export const Route = createFileRoute("/profile/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { user } = useAuth();
  const [selectedImage, setSelectedImage] = useState("");
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const updateProfileMutation = useUpdateUserProfile();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    setIsLoading(true);
    setError(false);
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData) as {
      displayName?: string;
      profilePicture: File;
    };

    if (data.profilePicture && data.profilePicture?.size / 1000000 > 3) {
      toast.error(
        `Image size shouldn't be more than 3MB. \n Current size is ${Math.floor(data.profilePicture.size / 1000000)} MB`,
      );
      setError(true);
      setIsLoading(false);
      return;
    }

    if (
      data.profilePicture.size > 0 &&
      data.profilePicture.type.split("/")[0].toLowerCase() !== "image"
    ) {
      toast.error("Select an image.");
      setError(true);
      setIsLoading(false);
      return;
    }

    const uploadedPhotoUrl = await uploadImageToCloudinary(data.profilePicture);
    updateProfileMutation.mutate({
      profilePic: uploadedPhotoUrl,
      displayName: data.displayName,
    });
  };

  const uploadImageToCloudinary = async (imageFile: File) => {
    if (imageFile.size <= 0) {
      setIsLoading(false);
      return;
    }
    const formData = new FormData();
    formData.append("file", imageFile);
    formData.append("upload_preset", "upload_1");
    try {
      const request = await fetch(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        },
      );
      const response = await request.json();

      if (response.error) {
        throw error;
      }

      if (response.secure_url) {
        return response.secure_url;
      }
      return;
    } catch {
      setError(true);
      toast.error("Error uploading image, try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="flex h-full flex-col gap-y-4">
        <form
          action=""
          onSubmit={handleSubmit}
          className="flex flex-col gap-y-4"
        >
          <span>{user?.email}</span>
          <div className="flex flex-col gap-y-2">
            <label className="text-primary" htmlFor="diplayName">
              Display name
            </label>
            <input
              className="border-primary rounded-xl border p-2 focus:outline-none"
              type="text"
              name="displayName"
              defaultValue={user?.displayName}
            />
          </div>
          <div className="flex flex-col gap-y-2">
            <label className="text-primary" htmlFor="profilePicture">
              Profile picture{" "}
              <span className="text-foreground text-xs">
                (Not more than 3MB)
              </span>
            </label>
            <input
              className="border-primary rounded-xl border p-1"
              type="file"
              name="profilePicture"
              onChange={handleFileChange}
            />
            {selectedImage ? (
              <img
                src={selectedImage}
                className="size-40 rounded-xl"
                loading="lazy"
              />
            ) : (
              user?.profilePic && (
                <img
                  src={user.profilePic}
                  className="size-40 rounded-xl"
                  alt="User Profile picture"
                  loading="lazy"
                />
              )
            )}
          </div>
          <div className="flex flex-row items-center justify-between">
            <button
              disabled={isLoading}
              onClick={() => setSelectedImage("")}
              type="reset"
              className="btn-error"
            >
              Cancel{" "}
            </button>
            <button
              disabled={isLoading}
              type="submit"
              className="btn-fill self-end"
            >
              {isLoading ? "Updating profile..." : "Update Profile"}
            </button>
          </div>
        </form>
      </div>
    </ProtectedRoute>
  );
}
