import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ReviewPage = () => {
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: "", text: "" });
  const [userEmail, setUserEmail] = useState(null); // Kirjautuneen käyttäjän sähköposti
  const navigate = useNavigate();

  // Hae kirjautuneen käyttäjän sähköposti localStoragesta
  useEffect(() => {
    const email = localStorage.getItem("email"); // Avaa localStoragesta tallennettu sähköposti
    if (email) {
      setUserEmail(email); // Tallenna sähköposti tilaan
    }
  }, []);

  const handleAddReview = () => {
    if (!newReview.rating || !newReview.text) {
      alert("Please fill out both rating and review text.");
      return;
    }

    if (!userEmail) {
      alert("You must be logged in to submit a review.");
      return;
    }

    const review = {
      rating: newReview.rating,
      text: newReview.text,
      email: userEmail, // Lisää kirjautuneen käyttäjän sähköposti
    };

    // Päivitä arvostelut
    setReviews((prevReviews) => [...prevReviews, review]);
    setNewReview({ rating: "", text: "" }); // Tyhjennä lomake
  };

  return (
    <div>
      <h1
        style={{ cursor: "pointer", color: "blue" }}
        onClick={() => navigate("/")}
      >
        Reviews
      </h1>

      <h3>User Reviews</h3>
      {reviews.length > 0 ? (
        <ul>
          {reviews.map((review, index) => (
            <li key={index}>
              <p><strong>Rating:</strong> {review.rating} / 5</p>
              <p><strong>Review:</strong> {review.text}</p>
              <p><strong>User:</strong> {review.email}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No reviews yet.</p>
      )}

      {userEmail ? (
        <div>
          <h3>Add a Review</h3>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAddReview();
            }}
          >
            <div>
              <label>
                Rating (1-5):
                <select
                  value={newReview.rating}
                  onChange={(e) =>
                    setNewReview({ ...newReview, rating: e.target.value })
                  }
                >
                  <option value="">Select</option>
                  {[1, 2, 3, 4, 5].map((num) => (
                    <option key={num} value={num}>
                      {num}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div>
              <label>
                Review Text:
                <textarea
                  value={newReview.text}
                  onChange={(e) =>
                    setNewReview({ ...newReview, text: e.target.value })
                  }
                ></textarea>
              </label>
            </div>
            <button type="submit">Submit Review</button>
          </form>
        </div>
      ) : (
        <p>Please log in to add a review.</p>
      )}
    </div>
  );
};

export default ReviewPage;

