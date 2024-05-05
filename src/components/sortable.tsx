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
  //
  useEffect(() => {
    const draggableHandles = document.querySelectorAll(".draggable-handle");

    const draggableContainerHandles = document.querySelectorAll(
      ".draggable-container-handle"
    );

    const draggableContainers = document.querySelectorAll(
      ".draggable-container"
    );

    draggableHandles.forEach((handle) => {
      handle.addEventListener("dragstart", (e) => {
        // Start dragging from the draggable-handle element
        const draggable = handle.parentElement;
        if (draggable) {
          draggable.classList.add("dragging");
        }
      });

      handle.addEventListener("dragend", (e) => {
        // End dragging
        const draggable = handle.parentElement;
        if (draggable) {
          draggable.classList.remove("dragging");
        }
        populateUpdatedList();
      });
    });

    draggableContainerHandles.forEach((handle) => {
      handle.addEventListener("dragstart", (e) => {
        // Start dragging from the draggable-handle element
        const draggable = handle.parentElement;
        if (draggable) {
        //   draggableContainers.forEach((container) => {
        //     container.classList.remove("h-max");
        //     container.classList.add("h-20");
        //     container.classList.add("overflow-clip");
        //   });
          draggable.classList.add("dragging-container");
        }
      });

      handle.addEventListener("dragend", (e) => {
        // End dragging
        const draggable = handle.parentElement;
        if (draggable) {
        //   draggableContainers.forEach((container) => {
        //     container.classList.add("h-max");
        //     container.classList.remove("h-20");
        //     container.classList.remove("overflow-clip");
        //   });
          draggable.classList.remove("dragging-container");
        }
        populateUpdatedList();
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

    function getDragAfterElement2(item: any, y: number) {
      const draggableElements = [
        ...item.querySelectorAll(
          ".draggable-container:not(.dragging-container)"
        ),
      ];
      console.log(draggableElements);
      return draggableElements.reduce(
        (closest, child) => {
          const box = child.getBoundingClientRect();
          const offset = y - box.top - box.height / 2;
          console.log(offset);
          if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
          } else {
            return closest;
          }
        },
        { offset: Number.NEGATIVE_INFINITY }
      ).element;
    }

    const ultimateContainer = document.querySelectorAll(".ultimate-container");

    ultimateContainer?.forEach((item) =>
      item.addEventListener("dragover", (e: any) => {
        e.preventDefault();
        const afterElement = getDragAfterElement2(item, e.clientY);
        const draggable = document.querySelector(".dragging-container");

        console.log(item, e.clientY);
        if (item && draggable) {
          if (afterElement == null) {
            item?.appendChild(draggable!);
          } else {
            item?.insertBefore(draggable!, afterElement);
          }
        }
      })
    );

    const container = document.querySelectorAll(".container");

    container?.forEach((item) =>
      item.addEventListener("dragover", (e: any) => {
        e.preventDefault();
        const afterElement = getDragAfterElement(item, e.clientY);
        const draggable = document.querySelector(".dragging");

        if (item && draggable) {
          if (afterElement == null) {
            item?.appendChild(draggable!);
          } else {
            item?.insertBefore(draggable!, afterElement);
          }
        }
      })
    );

    return () => {
      draggableHandles.forEach((handle) => {
        // Remove event listeners
        handle.removeEventListener("dragstart", () => {});
        handle.removeEventListener("dragend", () => {});
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
        className=" bg-[#eed9d9] flex flex-col ultimate-container p-10"
      >
        {list?.map((item: any, index: any) => (
          <div
            key={index}
            className="w-[50vw] h-max min-h-20 flex flex-col container ani shrink-0 pl-20 relative justify-start draggable-container"
          >
            <div
              draggable={true}
              className="absolute left-6 top-6 h-8 w-8 bg-[purple] draggable-container-handle"
            ></div>
            {item?.map((item: any) => (
              <div
                draggable={false}
                key={item.key}
                id={item.key.toString()}
                className="w-full h-20 border border-black flex items-center justify-center text-center text-[black] select-none draggable relative shrink-0 ani"
              >
                <div
                  draggable={true}
                  className="absolute left-8 h-8 w-8 bg-[violet] draggable-handle"
                ></div>
                {item.data}
              </div>
            ))}
          </div>
        ))}
        <p
          ref={newListDisplayRef}
          className="w-[50vw] text-center text-[white] hidden"
        >
          No new update
        </p>
      </div>
    </>
  );
}
