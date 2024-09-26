"use client";

import { addTestimonial } from "@/store/slices/testimonialSlice";
import { Button, Label, Modal, TextInput, Toast } from "flowbite-react";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { useUser } from "@clerk/nextjs";
import { FaUser, FaEnvelope, FaImage, FaStar, FaComment } from "react-icons/fa";

const TestimonialForm = () => {
  const [openModal, setOpenModal] = useState(false);
  const [userId, setUserId] = useState("");
  const [emailID, setEmailID] = useState("");
  const [avatar, setAvatar] = useState("");
  const [rating, setRating] = useState(5);
  const [remark, setRemark] = useState("");
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(true);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { user } = useUser();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const testimonialData = { userId, emailID, avatar, rating, remark };

    try {
      await dispatch(addTestimonial(testimonialData));
      setIsSuccess(true);
      setToastMessage("Testimonial submitted successfully!");
    } catch (error) {
      setIsSuccess(false);
      setToastMessage("Failed to submit testimonial.");
    }

    setToastVisible(true);
    setLoading(false);

    // Clear fields
    setUserId("");
    setEmailID("");
    setAvatar("");
    setRating(5);
    setRemark("");
    setOpenModal(false);

    // Hide toast after 10 seconds
    setTimeout(() => {
      setToastVisible(false);
    }, 10000);
  };

  return (
    <>
      <motion.div
        className="flex justify-end"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Button
          outline
          gradientDuoTone="purpleToBlue"
          className="mt-6 animate-pulse-smooth"
          onClick={() => setOpenModal(true)}
        >
          You like our app? Give feedback!
        </Button>
      </motion.div>

      <Modal
        show={openModal}
        size="md"
        onClose={() => setOpenModal(false)}
        popup
      >
        <Modal.Header>
          <div className="text-xl font-medium">Give Feedback</div>
        </Modal.Header>
        <Modal.Body className="backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ type: "spring", stiffness: 50, duration: 0.6 }}
          >
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div className="mb-2 block">
                  <Label htmlFor="userId" value="Name" />
                  <TextInput
                    id="userId"
                    type="text"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    required
                    placeholder={user ? user.firstName : "Enter your name"}
                    icon={FaUser}
                  />
                </div>
                <div>
                  <Label htmlFor="emailID" value="Email" />
                  <TextInput
                    id="emailID"
                    type="email"
                    value={emailID}
                    onChange={(e) => setEmailID(e.target.value)}
                    placeholder={
                      user ? user.emailAddresses[0].email : "Enter your email"
                    }
                    icon={FaEnvelope}
                  />
                </div>
                <div>
                  <Label htmlFor="avatar" value="Avatar (URL)" />
                  <TextInput
                    id="avatar"
                    type="text"
                    value={avatar}
                    onChange={(e) => setAvatar(e.target.value)}
                    placeholder="Enter the image URL"
                    required
                    icon={FaImage}
                  />
                </div>
                <div>
                  <Label htmlFor="rating" value="Rating (0-5)" />
                  <TextInput
                    id="rating"
                    type="number"
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                    min={0}
                    max={5}
                    required
                    icon={FaStar}
                  />
                </div>
                <div>
                  <Label htmlFor="remark" value="Remark" />
                  <TextInput
                    id="remark"
                    type="text"
                    value={remark}
                    onChange={(e) => setRemark(e.target.value)}
                    required
                    icon={FaComment}
                  />
                </div>
                <div className="w-full flex justify-center mt-4">
                  <Button
                    outline
                    gradientDuoTone="purpleToBlue"
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="flex items-center">
                        <span className="mr-2 animate-spin">🔄</span>
                        Submitting...
                      </span>
                    ) : (
                      "Submit Testimonial"
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </motion.div>
        </Modal.Body>
      </Modal>

      {toastVisible && (
        <div
          className={`toast ${
            isSuccess ? "bg-green-500" : "bg-red-500"
          } fixed bottom-5 right-5`}
        >
          <Toast>
            <div className="flex items-center">
              <span className="mr-2">{isSuccess ? "✅" : "❌"}</span>
              <div>{toastMessage}</div>
            </div>
          </Toast>
        </div>
      )}
    </>
  );
};

export default TestimonialForm;
