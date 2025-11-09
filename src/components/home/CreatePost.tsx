import React, { useState } from "react";

type CreatePostProps = {
  onCreatePost?: (payload: { imageUrl: string; caption: string }) => void;
};

function CreatePost({ onCreatePost }: CreatePostProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [pictureUrl, setPictureUrl] = useState("");
  const [caption, setCaption] = useState("");

  function handlePostClick() {
    // validation
    if (!pictureUrl.trim() || !caption.trim()) {
      alert("Please add both a picture URL and a caption!");
      return;
    }

    try {
      // call parent handler only if provided
      if (typeof onCreatePost === "function") {
        onCreatePost({ imageUrl: pictureUrl.trim(), caption: caption.trim() });
      } else {
        // fallback: if parent didn't pass a handler, just log it (won't crash)
        console.warn("onCreatePost not provided — new post:", {
          imageUrl: pictureUrl.trim(),
          caption: caption.trim(),
        });
      }

      // reset
      setPictureUrl("");
      setCaption("");
      setIsExpanded(false);
    } catch (err) {
      console.error("Error creating post:", err);
      alert("Something went wrong while creating the post — check console.");
    }
  }

  return (
    <section
      className={`w-[70%] ${
        isExpanded ? "h-[350px]" : "h-[170px]"
      } bg-[#FF43A1] text-white rounded-[25px] overflow-hidden relative mx-auto mt-20 transition-all duration-500 ease-in-out`}
    >
      {/* Content */}
      <div className="flex relative z-10">
        {/* Text Content */}
        <div className="ml-10 mt-7">
          <h1 className="text-4xl font-black mb-2.5">Hey, valxcicat!</h1>
          <p className="text-[17px] font-normal">
            Got a special moment with your pet? Share it with the <br />
            community and let your furry friend shine today!
          </p>
        </div>

        {/* Toggle Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`absolute transition-all duration-300 ${
            isExpanded
              ? "top-6 right-8 w-[150px] h-[38px]"
              : "ml-[780px] mt-[90px] w-[220px] h-[42px]"
          } rounded-[40px] bg-[#FCB43E] text-white border-none text-lg font-bold hover:bg-[#eaa02b]`}
        >
          {isExpanded ? "Cancel" : "Post your pet"}
        </button>
      </div>

      {/* Expanded Section */}
      {isExpanded && (
        <div className="flex items-start gap-4 ml-10 mt-8 relative z-10">
          {/* Upload Picture Box */}
          <div className="flex flex-col items-start">
            <p className="font-semibold text-white mb-2">Add a picture</p>
            <div className="w-[140px] h-[120px] flex items-center justify-center">
              <textarea
                value={pictureUrl}
                onChange={(e) => setPictureUrl(e.target.value)}
                placeholder="Picture Url..."
                className="w-[380px] h-[120px] bg-transparent border-2 border-white rounded-[15px] p-4 text-white placeholder:text-[#ffbcd9] resize-none outline-none"
              />
            </div>
          </div>

          {/* Text Area + Button */}
          <div className="flex relative mt-[30px] w-[810px]">
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Type something..."
              className="w-[340px] h-[120px] bg-transparent border-2 border-white rounded-[15px] p-4 text-white placeholder:text-[#ffbcd9] resize-none outline-none"
            />
            <button
              onClick={handlePostClick}
              className="absolute bottom-0 right-0 w-[220px] h-[42px] rounded-[40px] bg-[#FCB43E] text-white border-none text-lg font-bold hover:bg-[#eaa02b] transition-colors"
            >
              Post your pet
            </button>
          </div>
        </div>
      )}

      {/* Pattern Overlay (unchanged) */}
      <img
        src={
          isExpanded
            ? "/assets/vectors/patterns/ExtendedPattern.svg"
            : "/assets/vectors/patterns/ExtendedPattern.svg"
        }
        alt=""
        className={`absolute transition-all duration-400 ${
          isExpanded
            ? "h-[890px] ml-[460px] -mt-[502px]"
            : "h-[890px] ml-[450px] -mt-[530px]"
        } z-[1]`}
      />
    </section>
  );
}

export default CreatePost;
