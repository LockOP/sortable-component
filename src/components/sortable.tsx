"use client";
import { useEffect, useRef, useState } from "react";

export default function ReactSortable({ refresh, list }: any) {
  const newListRef = useRef<any>([]);
  const newListDisplayRef = useRef<any>(null);

  function populateUpdatedList() {
    const emptyArray: any = Array(list.length).fill(null);

    document.querySelectorAll(".container").forEach((container, index) => {
      let combinedList: any = [];
      list.forEach((item: any) => {
        combinedList.push(...item);
      });

      let updatedList: any = [];

      container.querySelectorAll(".draggable").forEach((newItem) => {
        const foundObj = combinedList.find(
          (item: any) => item?.key?.toString() == newItem?.id
        );
        updatedList.push(foundObj);
      });
      emptyArray[index] = updatedList;
    });

    newListRef.current = emptyArray;
    newListDisplayRef.current.textContent = JSON.stringify(emptyArray);
    localStorage.setItem("list", JSON.stringify(emptyArray));
  }

  useEffect(() => {
    const draggable = document.querySelectorAll(".draggable");

    draggable.forEach((item) => {
      item.addEventListener("dragstart", (e) => {
        item.classList.add("dragging");
      });
    });

    draggable.forEach((item) => {
      item.addEventListener("dragend", (e) => {
        item.classList.remove("dragging");
        //
      });
    });

    function getDragAfterElement(item: any, y: number) {
      const draggableElements = [
        ...item.querySelectorAll(".draggable:not(.dragging)"),
      ];

      return draggableElements.reduce(
        (closest, child) => {
          const box = child.getBoundingClientRect();
          const offset = y - box.top - box.height / 2;
          if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
          } else {
            return closest;
          }
        },
        { offset: Number.NEGATIVE_INFINITY }
      ).element;
    }

    const container = document.querySelectorAll(".container");

    container?.forEach((item) =>
      item.addEventListener("dragover", (e: any) => {
        e.preventDefault();
        const afterElement = getDragAfterElement(item, e.clientY);
        const draggable = document.querySelector(".dragging");
        if (afterElement == null) {
          item?.appendChild(draggable!);
        } else {
          item?.insertBefore(draggable!, afterElement);
        }
      })
    );

    return () => {
      draggable.forEach((item) => {
        item.removeEventListener("dragstart", (e) => {
          item.classList.add("dragging");
        });
        item.removeEventListener("dragend", (e) => {
          item.classList.remove("dragging");
        });
      });

      container?.forEach((item) =>
        item.removeEventListener("dragover", (e: any) => {
          e.preventDefault();
          const afterElement = getDragAfterElement(item, e.clientY);
          const draggable = document.querySelector(".dragging");
          if (afterElement == null) {
            item?.appendChild(draggable!);
          } else {
            item?.insertBefore(draggable!, afterElement);
          }
        })
      );
    };
  });
  return (
    <>
      <div
        key={refresh}
        onDragEndCapture={() => populateUpdatedList()}
        className=" bg-[red] flex flex-col gap-10"
      >
        {list?.map((item: any, index: any) => (
          <div
            key={index}
            className="w-[50vw] h-max min-h-20 bg-[pink] flex flex-col container ani shrink-0 pl-20"
          >
            {item?.map((item: any) => (
              <div
                draggable={true}
                key={item.key}
                id={item.key.toString()}
                className="w-full h-20 border border-black flex items-center justify-center text-center text-[black] select-none draggable ani relative"
              >
                <div className="absolute left-8 h-8 w-8 bg-[violet] draggable-handle"></div>
                {item.data}
              </div>
            ))}
          </div>
        ))}
        <p
          ref={newListDisplayRef}
          className="w-[50vw] text-center text-[white]"
        >
          No new update
        </p>
      </div>
    </>
  );
}
