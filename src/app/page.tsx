"use client";
import ReactSortable from "@/components/sortable";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Home() {
  const [refresh, setRefresh] = useState<any>(0);
  const list = [
    [
      { key: 1, data: 1 },
      { key: 2, data: 2 },
      { key: 3, data: 3 },
    ],
    [
      { key: 6, data: 6 },
      { key: 7, data: 7 },
      { key: 8, data: 8 },
    ],
    [
      { key: 9, data: 9 },
      { key: 10, data: 10 },
      { key: 11, data: 11 },
      { key: 12, data: 12 },
    ],
  ];

  let [storageList, setStorageList] = useState<any>([]);

  useEffect(() => {
    setStorageList(
      localStorage ? JSON.parse(localStorage.getItem("list") || "[]") : []
    );
  }, [refresh]);

  return (
    <>
      <div className="w-screen h-[100dvh] bg-[orange] flex flex-col justify-center items-center gap-8 relative">
        <ReactSortable
          refresh={refresh}
          list={storageList.length ? storageList : list}
        />
        <button
          onClick={() => setRefresh(refresh + 1)}
          className="absolute top-0 right-0 bg-[lightgreen]"
        >
          Refresh
        </button>
      </div>
    </>
  );
}
