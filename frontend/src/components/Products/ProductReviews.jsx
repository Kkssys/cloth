import React, { useState, useEffect, useCallback } from 'react';
import axios from '../../utils/axios';
import toast from 'react-hot-toast';

const ProductReviews = ({ productId, userInfo }) => {
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  const [reviewData, setReviewData] = useState({
    rating: 5,
    title: '',
    comment: '',
    media: [],
  });
  const [selectedMedia, setSelectedMedia] = useState([]);
  const [mediaPreviews, setMediaPreviews] = useState([]);

  // Wrap fetchReviews in useCallback to prevent unnecessary re-renders
  const fetchReviews = useCallback(async () => {
    try {
      const { data } = await axios.get(`/products/${productId}/reviews`);
      setReviews(data.reviews || []);
      setAverageRating(data.averageRating || 0);
      setTotalReviews(data.totalReviews || 0);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleMediaSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) {
      toast.error('You can only upload up to 5 files');
      return;
    }
    
    setSelectedMedia(files);
    const previews = files.map(file => URL.createObjectURL(file));
    setMediaPreviews(previews);
  };

  const removeMedia = (index) => {
    const newMedia = [...selectedMedia];
    newMedia.splice(index, 1);
    setSelectedMedia(newMedia);
    
    const newPreviews = [...mediaPreviews];
    URL.revokeObjectURL(newPreviews[index]);
    newPreviews.splice(index, 1);
    setMediaPreviews(newPreviews);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    
    if (!userInfo) {
      toast.error('Please login to submit a review');
      return;
    }
    
    if (!reviewData.comment.trim()) {
      toast.error('Please write a review comment');
      return;
    }
    
    setSubmitting(true);
    
    try {
      const formData = new FormData();
      formData.append('rating', reviewData.rating);
      formData.append('title', reviewData.title);
      formData.append('comment', reviewData.comment);
      
      selectedMedia.forEach(file => {
        formData.append('images', file);
      });
      
      await axios.post(`/products/${productId}/reviews`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      
      toast.success('Review submitted successfully!');
      setShowReviewForm(false);
      setReviewData({ rating: 5, title: '', comment: '', media: [] });
      setSelectedMedia([]);
      setMediaPreviews([]);
      fetchReviews();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const handleMarkHelpful = async (reviewId) => {
    try {
      await axios.put(`/products/${productId}/reviews/${reviewId}/helpful`);
      fetchReviews();
      toast.success('Thanks for your feedback!');
    } catch (error) {
      toast.error('Failed to mark as helpful');
    }
  };

  const renderStars = (rating, interactive = false) => {
    return (
      <div style={{ display: 'flex', gap: '5px' }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            onClick={() => interactive && setReviewData({ ...reviewData, rating: star })}
            style={{
              cursor: interactive ? 'pointer' : 'default',
              fontSize: '20px',
              color: star <= rating ? '#fbbf24' : '#d1d5db',
            }}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  const styles = {
    container: {
      marginTop: '2rem',
      borderTop: '1px solid #e5e7eb',
      paddingTop: '2rem',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '1.5rem',
      flexWrap: 'wrap',
      gap: '1rem',
    },
    title: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
    },
    ratingSummary: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
    },
    averageRating: {
      fontSize: '2rem',
      fontWeight: 'bold',
      color: '#4f46e5',
    },
    reviewBtn: {
      backgroundColor: '#4f46e5',
      color: 'white',
      padding: '0.5rem 1rem',
      border: 'none',
      borderRadius: '0.375rem',
      cursor: 'pointer',
    },
    reviewCard: {
      backgroundColor: 'white',
      borderRadius: '0.5rem',
      padding: '1rem',
      marginBottom: '1rem',
      boxShadow: '0 1px 3px 0 rgba(0,0,0,0.1)',
    },
    reviewHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '0.5rem',
      flexWrap: 'wrap',
      gap: '0.5rem',
    },
    reviewerName: {
      fontWeight: 'bold',
      color: '#1f2937',
    },
    reviewDate: {
      fontSize: '0.75rem',
      color: '#6b7280',
    },
    reviewTitle: {
      fontWeight: '600',
      marginBottom: '0.5rem',
      fontSize: '1rem',
    },
    reviewComment: {
      color: '#4b5563',
      marginBottom: '0.5rem',
      lineHeight: '1.5',
    },
    mediaGrid: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '0.5rem',
      marginTop: '0.5rem',
    },
    mediaItem: {
      width: '80px',
      height: '80px',
      borderRadius: '0.375rem',
      overflow: 'hidden',
      cursor: 'pointer',
    },
    mediaImg: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
    },
    helpfulBtn: {
      background: 'none',
      border: 'none',
      color: '#6b7280',
      fontSize: '0.75rem',
      cursor: 'pointer',
      marginTop: '0.5rem',
    },
    formContainer: {
      backgroundColor: '#f9fafb',
      borderRadius: '0.5rem',
      padding: '1rem',
      marginBottom: '1rem',
    },
    formGroup: {
      marginBottom: '1rem',
    },
    label: {
      display: 'block',
      fontWeight: '500',
      marginBottom: '0.25rem',
    },
    input: {
      width: '100%',
      padding: '0.5rem',
      border: '1px solid #d1d5db',
      borderRadius: '0.375rem',
    },
    textarea: {
      width: '100%',
      padding: '0.5rem',
      border: '1px solid #d1d5db',
      borderRadius: '0.375rem',
      minHeight: '80px',
    },
    mediaUploadArea: {
      border: '2px dashed #d1d5db',
      borderRadius: '0.5rem',
      padding: '1rem',
      textAlign: 'center',
      cursor: 'pointer',
    },
    previewContainer: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '0.5rem',
      marginTop: '0.5rem',
    },
    previewItem: {
      position: 'relative',
      width: '80px',
      height: '80px',
    },
    removeBtn: {
      position: 'absolute',
      top: '-5px',
      right: '-5px',
      backgroundColor: '#ef4444',
      color: 'white',
      borderRadius: '50%',
      width: '20px',
      height: '20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
    },
    submitBtn: {
      backgroundColor: '#4f46e5',
      color: 'white',
      padding: '0.5rem 1rem',
      border: 'none',
      borderRadius: '0.375rem',
      cursor: 'pointer',
    },
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '2rem' }}>Loading reviews...</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h3 style={styles.title}>Customer Reviews</h3>
          <div style={styles.ratingSummary}>
            <span style={styles.averageRating}>{averageRating}</span>
            <div>{renderStars(Math.round(averageRating))}</div>
            <span>({totalReviews} reviews)</span>
          </div>
        </div>
        {userInfo && !showReviewForm && (
          <button onClick={() => setShowReviewForm(true)} style={styles.reviewBtn}>
            Write a Review
          </button>
        )}
      </div>

      {/* Rest of the component remains the same */}
      {showReviewForm && (
        <div style={styles.formContainer}>
          <h4 style={{ marginBottom: '1rem' }}>Write Your Review</h4>
          <form onSubmit={handleSubmitReview}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Rating *</label>
              {renderStars(reviewData.rating, true)}
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Review Title</label>
              <input
                type="text"
                value={reviewData.title}
                onChange={(e) => setReviewData({ ...reviewData, title: e.target.value })}
                style={styles.input}
                placeholder="Summarize your experience"
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Your Review *</label>
              <textarea
                value={reviewData.comment}
                onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
                style={styles.textarea}
                placeholder="Share your experience with this product..."
                required
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Add Photos/Videos (Optional, up to 5)</label>
              <div style={styles.mediaUploadArea} onClick={() => document.getElementById('reviewMedia').click()}>
                📸 Click to upload images or videos
                <input
                  id="reviewMedia"
                  type="file"
                  multiple
                  accept="image/*,video/*"
                  onChange={handleMediaSelect}
                  style={{ display: 'none' }}
                />
              </div>
              {mediaPreviews.length > 0 && (
                <div style={styles.previewContainer}>
                  {mediaPreviews.map((preview, index) => (
                    <div key={index} style={styles.previewItem}>
                      {selectedMedia[index]?.type?.startsWith('image/') ? (
                        <img src={preview} alt="Preview" style={styles.mediaImg} />
                      ) : (
                        <video src={preview} style={styles.mediaImg} />
                      )}
                      <button type="button" onClick={() => removeMedia(index)} style={styles.removeBtn}>×</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button type="submit" style={styles.submitBtn} disabled={submitting}>
                {submitting ? 'Submitting...' : 'Submit Review'}
              </button>
              <button type="button" onClick={() => setShowReviewForm(false)} style={{ ...styles.submitBtn, backgroundColor: '#9ca3af' }}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {reviews.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#6b7280', padding: '2rem' }}>
          No reviews yet. Be the first to review this product!
        </p>
      ) : (
        reviews.map((review) => (
          <div key={review._id} style={styles.reviewCard}>
            <div style={styles.reviewHeader}>
              <div>
                <span style={styles.reviewerName}>{review.userName}</span>
                <div>{renderStars(review.rating)}</div>
              </div>
              <span style={styles.reviewDate}>
                {new Date(review.createdAt).toLocaleDateString()}
              </span>
            </div>
            {review.title && <div style={styles.reviewTitle}>{review.title}</div>}
            <div style={styles.reviewComment}>{review.comment}</div>
            {review.media && review.media.length > 0 && (
              <div style={styles.mediaGrid}>
                {review.media.map((item, idx) => (
                  <div key={idx} style={styles.mediaItem}>
                    {item.type === 'image' ? (
                      <img src={item.url} alt="Review" style={styles.mediaImg} />
                    ) : (
                      <video src={item.url} style={styles.mediaImg} />
                    )}
                  </div>
                ))}
              </div>
            )}
            <button onClick={() => handleMarkHelpful(review._id)} style={styles.helpfulBtn}>
              👍 Helpful ({review.helpful?.length || 0})
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default ProductReviews;