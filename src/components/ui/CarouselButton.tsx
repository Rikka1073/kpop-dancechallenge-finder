import { ChevronLeft, ChevronRight } from "lucide-react";
import Button from "./Button";
import { CarouselButtonProps } from "@/types";

const CarouselButton = ({ emblaApi }: CarouselButtonProps) => {
  const scrollPrev = () => {
    if (emblaApi) emblaApi.scrollPrev();
  };

  const scrollNext = () => {
    if (emblaApi) emblaApi.scrollNext();
  };
  return (
    <div className="flex gap-2">
      <Button
        onClick={scrollPrev}
        className="lg:btn-md rounded-full bg-white p-2 text-gray-600 shadow-lg transition-all hover:bg-gray-50 hover:text-purple-600"
        aria-label="前へ"
      >
        <ChevronLeft />
      </Button>
      <Button
        onClick={scrollNext}
        className="lg:btn-md rounded-full bg-white p-2 text-gray-600 shadow-lg transition-all hover:bg-gray-50 hover:text-purple-600"
        aria-label="次へ"
      >
        <ChevronRight />
      </Button>
    </div>
  );
};

export default CarouselButton;
