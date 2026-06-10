import type React from "react";

export interface ComplaintCardProps {
    title: string;
    description: string;
    image?: string;
    category: string;
    priority: "low" | "medium" | "high" | "critical";
    status: string;
    createdAt: string;
}

export const ComplaintCard: React.FC<ComplaintCardProps> = ({ title, description, image, category, priority, status, createdAt }) => {

    const priorityColors = {
        low: "bg-green-100 text-green-700",
        medium: "bg-yellow-100 text-yellow-700",
        high: "bg-orange-100 text-orange-700",
        critical: "bg-red-100 text-red-700",
    };

    return (
        <div className="w-full max-w-100 rounded-2xl border border-white/5 bg-white/5 backdrop:blur-sm p-5 shadow-sm transition hover:shadow-md">
            {/* Header */}
            {image &&
                <div className="w-full h-auto rounded-lg overflow-hidden mb-4">
                    <img className="w-full object-cover aspect-auto" src={image} alt="image" />
                </div>
            }
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h3 className="text-lg font-semibold text-white">{title}</h3>
                    <p className="mt-1 text-sm text-gray-500">
                        {createdAt}
                    </p>
                </div>

                <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${priorityColors[priority]
                        }`}
                >
                    {priority}
                </span>
            </div>

            {/* Description */}
            <p className="mt-4 line-clamp-3 text-sm leading-6 text-gray-600">
                {description}
            </p>

            {/* Footer */}
            <div className="mt-5 flex flex-wrap items-center gap-2">
                <span className="rounded-lg bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                    {category}
                </span>

                <span className="rounded-lg bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                    {status}
                </span>
            </div>
        </div>
    );
}