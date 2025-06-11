import { createFileRoute } from "@tanstack/react-router";
import React, { useState } from "react";
import ProtectedRoute from "../../components/ProtectedRoute";

export const Route = createFileRoute("/profile/")({
  component: RouteComponent,
});

function RouteComponent() {
  const [selectedImage, setSelectedImage] = useState("");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    // check image size, and if it's more than expected, throw an error to the user, saying the maximum size exceeded.
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData);
    console.log("profile data", data);
  };
  const displayName = undefined;
  return (
    <ProtectedRoute>
      <div className="flex h-full flex-col gap-y-4">
        <form
          action=""
          onSubmit={handleSubmit}
          className="flex flex-col gap-y-4"
        >
          <div className="flex flex-col gap-y-2">
            <label className="text-primary" htmlFor="about">
              About you
            </label>
            <input
              required
              className="border-primary rounded-xl border p-2 focus:outline-none"
              type="text"
              name="about"
              defaultValue={displayName ?? "You haven't set anything yet."}
            />
          </div>
          <div className="flex flex-col gap-y-2">
            <label className="text-primary" htmlFor="profilePicture">
              Profile picture
            </label>
            <input
              required
              className="border-primary rounded-xl border p-1"
              type="file"
              name="profilePicture"
              onChange={handleFileChange}
            />
            {selectedImage ? (
              <img src={selectedImage} className="size-40 rounded-xl" />
            ) : null}
          </div>
          <div className="flex flex-row items-center justify-between">
            <button
              onClick={() => setSelectedImage("")}
              type="reset"
              className="btn-error"
            >
              Cancel{" "}
            </button>
            <button type="submit" className="btn-fill self-end">
              Update Profile
            </button>
          </div>
        </form>
      </div>
    </ProtectedRoute>
  );
}
