import { useContext, useEffect, useRef, useState } from "react";
import { FaCaretDown, FaCaretUp } from "react-icons/fa6";

import TimerContext from "../context/timerContext";
import DataContext from "../context/dataContext";

import { AudioManager } from "../components/AudioManager";

export const MenuGuidedMeditations = () => {
  const { isRunning, setTimer } = useContext(TimerContext);
  const { meditations } = useContext(DataContext);

  const [isOpen, setIsOpen] = useState(false);
  const [selectedMeditation, setSelectedMeditation] = useState({
    title: "",
    src: "",
    duration: 600,
  });

  const dropdownRef = useRef();

  //funzione che al click apre il dropdown menu
  const showMenu = (e) => {
    setIsOpen((prev) => !prev);
  };

  //funzione per chiudere il menu quando si verifica un clikc fuori di esso
  const closeMenuOnOutsideClick = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setIsOpen(false);
    }
  };

  //funzione per creare gli elementi del menu
  const meditationsElements = meditations.map((meditation) => (
    <div
      className="grid grid-cols-4 items-center font-semibold mobile-menu mx-3 my-4 md:text-2xl md:mx-6 md:my-6"
      key={meditation.title}
      onClick={(e) => selectMeditation(e, meditation.src)}
    >
      <h3 className="col-span-3 ">{meditation.title}</h3>
      <p className="justify-self-end">{meditation.duration / 60} Min.</p>
    </div>
  ));

  //funzione per impostare la meditazione selezionata
  const selectMeditation = (e, sound) => {
    let meditation = {
      title: `${
        e.target.tagName === "P"
          ? e.target.previousSibling.innerText
          : e.target.innerText
      }`,
      src: sound,
    };
    setSelectedMeditation((prev) => ({
      ...prev,
      title: meditation.title,
      src: meditation.src,
    }));
    setTimer(selectedMeditation.duration);
  };

  useEffect(() => {
    document.addEventListener("click", closeMenuOnOutsideClick);

    return () => {
      document.removeEventListener("click", closeMenuOnOutsideClick);
    };
  }, []);

  return (
    <div className="w-full flex flex-col items-center">
      <div
        className="select-meditation-dropdown flex flex-row items-center justify-center relative w-full mt-4 mb-2 md:mt-8 md:mb-4"
        onClick={showMenu}
        ref={dropdownRef}
      >
        <h1 className="text-2xl font-bold md:text-4xl">
          {selectedMeditation.title === ""
            ? "Select guided Meditation"
            : selectedMeditation.title}
        </h1>
        {isOpen ? (
          <FaCaretUp className="text-2xl md:text-4xl" />
        ) : (
          <FaCaretDown className="text-2xl md:text-4xl" />
        )}
        {isOpen && (
          <div className="menu absolute top-14 left-[12%] right-[12%] z-10 w-[75%] py-2 bg-amber-400/80 rounded-xl md:py-4">
            {meditationsElements}
          </div>
        )}
      </div>
      <div className="hover:self-start hover:w-full transition-all duration-100">
        <AudioManager
          audio={selectedMeditation.src}
          isPlaying={isRunning}
          componentFor={"meditation"}
        />
      </div>
    </div>
  );
};
