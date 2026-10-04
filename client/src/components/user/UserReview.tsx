import { useUserReview } from "@/hooks/useUsers";
import { dateFormatter } from "@/utils/date";

const UserReview = ({ email }: { email?: string }) => {
  const { data: review, isLoading } = useUserReview(email);

  const reviews =
    review?.flatMap((product: any) =>
      product.reviews.map((item: any) => ({
        productId: product.id,
        productTitle: product.title,
        ...item,
      })),
    ) ?? [];

  const tableColumns: string[] = ["Product", "Rating", "Date", "Review"];
  return (
    <div className="w-[75%] flex flex-col gap-4 rounded-lg border border-gray-200 bg-white p-4 m-4 shadow-sm">
      <header className="flex items-center justify-between P-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 text-violet-600">
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M7 8h10M7 12h6m7 0a8 8 0 01-8 8 8.5 8.5 0 01-4.2-1.1L3 20l1.1-3.8A8 8 0 1119 12z"
              />
            </svg>
          </div>

          <div>
            <h3 className="text-base font-semibold text-slate-900">
              User Reviews
            </h3>
            <p className="mt-0.5 text-sm text-slate-500">
              Reviews submitted by this user
            </p>
          </div>
        </div>
        {/* Review count */}
        <div className="flex items-center gap-3 rounded-xl border border-violet-100 bg-white px-4 py-2.5 shadow-sm">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
            <span className="text-sm font-bold">★</span>
          </div>

          <div>
            <p className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
              Total Reviews
            </p>

            <p className="text-lg font-semibold leading-5 text-slate-900">
              {reviews.length}
            </p>
          </div>
        </div>
      </header>

      <table className="w-full">
        <thead className="bg-slate-100">
          <tr>
            {tableColumns.map((column) => (
              <th
                key={column}
                className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600"
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {reviews.map((review: any) => (
            <tr key={review.productId}>
              {/* Product */}
              <td className="px-5 py-4">
                <p className="text-sm font-semibold text-slate-900">
                  {review.productTitle}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Product ID #{review.productId}
                </p>
              </td>

              {/* Rating */}
              <td className="px-5 py-4">
                <span className="inline-flex items-center gap-1.5 rounded-md bg-amber-50 px-2.5 py-1.5 text-sm font-medium text-amber-700">
                  {review.rating}
                  <span className="text-amber-400">
                    {"★".repeat(Math.min(review.rating, 5))}
                  </span>
                </span>
              </td>

              {/* Date */}
              <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-500">
                {review.date ? dateFormatter(new Date(review.date)) : "N/A"}
              </td>

              {/* Review */}
              <td className="px-5 py-4 text-sm text-slate-600">
                {review.comment}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserReview;
