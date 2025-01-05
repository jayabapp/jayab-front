import React from "react";

// Define the interface for the props
interface QuestionCardProps {
  question: string;
  authorName: string;
  authorAvatar: string;
  date: string;
  responseDate: string;
  responseText: string;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  authorName,
  authorAvatar,
  date,
  responseDate,
  responseText,
}) => {
  return (
    <article
      className="flex flex-col gap-10 lg:gap-6 p-6 rounded-2xl"
      style={{ boxShadow: "0px 0px 10px 0px rgba(0, 0, 0, 0.15)" }}
    >
      <div className="flex flex-col lg:flex-row lg:items-center gap-2 lg:justify-between">
        <span>{question}</span>
        <div className="flex items-center gap-6">
          <span>{authorName}</span>
          <span>{date}</span>
        </div>
      </div>

      <div className="flex flex-col gap-4 pr-6">
        <div className="flex items-center justify-between pb-5 border-b-2 border-[#E4E5E7]">
          <div className="flex items-center justify-between gap-3">
            <div className="w-10 h-10 rounded-full">
              <img
                src={authorAvatar}
                alt=""
                className="w-full h-full aspect-square object-cover"
              />
            </div>
            <span className="text-primary-700 font-semibold">ابراتور</span>
          </div>
          <span>{responseDate}</span>
        </div>
        <p>{responseText}</p>
      </div>
    </article>
  );
};

export default QuestionCard;
