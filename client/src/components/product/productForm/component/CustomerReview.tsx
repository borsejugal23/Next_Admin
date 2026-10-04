import type { ProductReview } from "@/types/product";
import { formatDate } from "@/utils/date";
import { Star, Trash2 } from "lucide-react";
import { HeaderComponent } from "./FormComponent";
import useCan from "@/authorization/useCan";

function getInitials(name?: string) {
  if (!name?.trim()) return "?";
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

type ReviewItemProps = {
  review: ProductReview;
  onDelete: (review: ProductReview) => void;
};

/** Single review row — reusable anywhere you pass a ProductReview */
export function ReviewItem({ review, onDelete }: ReviewItemProps) {
  const {
    reviewerName = "Anonymous",
    reviewerEmail = "",
    comment = "",
    rating = 0,
    date = "",
  } = review;
  const canDelete = useCan("review:delete");
  return (
    <div className="flex items-start gap-3 px-4 py-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f7f0eb] text-xs font-semibold text-[#6e5f5d]">
        {getInitials(reviewerName)}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-1.5 text-sm">
          <span className="font-semibold text-[#1a0e0e]">{reviewerName}</span>
          <Star size={12} className="fill-[#e89b00] text-[#e89b00]" />
          <span className="font-medium text-[#1a0e0e]">{rating}</span>
          {date ? (
            <>
              <span className="text-[#6e5f5d]">·</span>
              <span className="text-[#6e5f5d]">{formatDate(date)}</span>
            </>
          ) : null}
        </div>
        {comment ? (
          <p className="mt-1 text-sm text-[#1a0e0e]">{comment}</p>
        ) : null}
        {reviewerEmail ? (
          <p className="mt-1 text-xs text-[#6e5f5d]">{reviewerEmail}</p>
        ) : null}
      </div>

      <div className="flex shrink-0 items-center gap-1">
        {canDelete && (
          <button
            type="button"
            aria-label="Delete review"
            onClick={() => onDelete(review)}
            className="rounded-lg p-1.5 text-[#6e5f5d] transition hover:bg-[#f7f0eb] hover:text-red-700 cursor-pointer"
          >
            <Trash2 size={14} />
          </button>
        )}
      </div>
    </div>
  );
}

type CustomerReviewProps = {
  reviews?: ProductReview[];
  rating?: number;
  onDelete: (review: ProductReview) => void;
};

/** Full Customer reviews card — pass reviews (+ optional product rating) */
export default function CustomerReview({
  reviews = [],
  rating,
  onDelete,
}: CustomerReviewProps) {
  // const average =
  //   rating ??
  //   (reviews.length
  //     ? reviews.reduce((sum, review) => sum + (review.rating ?? 0), 0) /
  //       reviews.length
  //     : 0);

  return (
    <div className="overflow-hidden rounded-xl border border-[#eae3de] bg-white">
      <HeaderComponent
        title="Customer reviews"
        headline="Moderate reviews shown on the storefront."
        icon={<Star size={16} className="text-gray-700" />}
        trailing={
          <div className="flex items-center gap-1.5 text-sm">
            <Star size={14} className="fill-[#e89b00] text-[#e89b00]" />
            <span className="font-semibold text-[#1a0e0e]">{rating}</span>
            <span className="text-[#6e5f5d]">({reviews.length})</span>
          </div>
        }
      />

      {reviews.length === 0 ? (
        <p className="px-4 py-6 text-sm text-[#6e5f5d]">No reviews yet.</p>
      ) : (
        <div className="divide-y divide-[#eae3de]">
          {reviews.map((review, index) => (
            <ReviewItem
              key={
                review._id ??
                `${review.reviewerEmail ?? review.reviewerName}-${index}`
              }
              review={review}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
