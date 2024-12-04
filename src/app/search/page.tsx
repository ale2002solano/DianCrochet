"use client";
import { Suspense } from "react";
import SearchComponent from "./components/SearchComponent";
import LoadingSpinner from "../checkout/components/loadding/LoadingSpinner";

export default function Products() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <SearchComponent />
    </Suspense>
  );
}
