import { useState } from "react";
import { useAppDispatch, useAuth } from "../../store/hooks";
import { createPostAsync, fetchPosts } from "../../store/slices/postsSlice";

function CreatePost() {
  const dispatch = useAppDispatch();
  const { currentUser } = useAuth();
  
  const [isExpanded, setIsExpanded] = useState(false);
  const [pictureUrl, setPictureUrl] = useState("");
  const [caption, setCaption] = useState("");

  async function handlePostClick() {
    // validation
    if (!pictureUrl.trim() || !caption.trim()) {
      alert("Please add both a picture URL and a caption!");
      return;
    }

    if (!currentUser) {
      alert("You must be logged in to create a post!");
      return;
    }

    try {
      // Dispatch async action to create post
      const result = await dispatch(createPostAsync({
        imageUrl: pictureUrl.trim(),
        caption: caption.trim(),
      }));

      if (createPostAsync.fulfilled.match(result)) {
        // Recargar posts para tener los datos más recientes desde Supabase
        await dispatch(fetchPosts());
        
        // reset
        setPictureUrl("");
        setCaption("");
        setIsExpanded(false);
      } else {
        alert("Error al crear el post: " + (result.payload as string));
      }
    } catch (err) {
      console.error("Error creating post:", err);
      alert("Something went wrong while creating the post — check console.");
    }
  }

  return (
    <section
      className={`w-full lg:w-[70%] ${
        isExpanded ? "h-auto min-h-[350px] lg:h-[350px]" : "h-[100px] lg:h-auto lg:min-h-[140px]"
      } bg-[#FF43A1] text-white rounded-[20px] lg:rounded-[25px] overflow-hidden relative mx-auto mt-4 lg:mt-20 transition-all duration-500 ease-in-out px-5 lg:px-0`}
    >
      {/* Content - Header Section */}
      <div className="flex items-start justify-between relative z-10 px-4 lg:px-10 py-3 lg:py-4">
        {/* Text Content */}
        <div className="flex-1">
          <h1 className="text-2xl lg:text-4xl font-black">Hey, {currentUser?.userName || 'friend'}!</h1>
          {/* Texto descriptivo solo en desktop - visible en ambas vistas */}
          <p className="hidden lg:block text-[17px] font-normal mt-2">
            Got a special moment with your pet? Share it with the <br />
            community and let your furry friend shine today!
          </p>
        </div>

        {/* Toggle Button - Posición diferente según estado */}
        {!isExpanded && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="hidden lg:block w-[220px] h-[42px] rounded-[40px] bg-[#FCB43E] text-white border-none text-lg font-bold hover:bg-[#eaa02b] transition-colors mt-2"
          >
            Post your pet
          </button>
        )}
        {isExpanded && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="hidden lg:block absolute top-6 right-8 w-[150px] h-[38px] rounded-[40px] bg-[#FCB43E] text-white border-none text-lg font-bold hover:bg-[#eaa02b] transition-colors z-20"
          >
            Cancel
          </button>
        )}
        {/* Botón móvil */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`lg:hidden transition-all duration-300 ${
            isExpanded
              ? "w-[100px] h-[32px] text-sm"
              : "w-[140px] h-[36px] text-sm"
          } rounded-[40px] bg-[#FCB43E] text-white border-none font-bold hover:bg-[#eaa02b]`}
        >
          {isExpanded ? "Cancel" : "Post your pet"}
        </button>
      </div>

      {/* Expanded Section */}
      {isExpanded && (
        <div className="flex flex-col lg:flex-row items-start gap-4 px-4 lg:px-10 pb-4 lg:pb-12 relative z-10">
          {/* Upload Picture Box - Más angosto (reducido 40px) */}
          <div className="flex flex-col items-start w-full lg:w-auto">
            <p className="font-semibold text-white mb-2 text-sm lg:text-base">Add a picture</p>
            <div className="w-full lg:w-[240px] flex items-center justify-center">
              <textarea
                value={pictureUrl}
                onChange={(e) => setPictureUrl(e.target.value)}
                placeholder="Picture Url..."
                className="w-full lg:w-[240px] h-[100px] lg:h-[120px] bg-transparent border-2 border-white rounded-[15px] p-3 lg:p-4 text-white placeholder:text-[#ffbcd9] resize-none outline-none text-sm lg:text-base"
              />
            </div>
          </div>

          {/* Text Area - Reducido a la mitad del ancho original, alineado horizontalmente */}
          <div className="flex flex-col items-start w-full lg:w-auto lg:pt-[30px]">
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Type something..."
              className="w-full lg:w-[170px] h-[100px] lg:h-[120px] bg-transparent border-2 border-white rounded-[15px] p-3 lg:p-4 text-white placeholder:text-[#ffbcd9] resize-none outline-none text-sm lg:text-base"
            />
          </div>

          {/* Botón "Post your pet" - En la parte inferior de la card */}
          <div className="w-full lg:w-auto flex justify-end lg:absolute lg:bottom-4 lg:right-8">
            <button
              onClick={handlePostClick}
              className="w-full lg:w-[220px] h-[38px] lg:h-[38px] rounded-[40px] bg-[#FCB43E] text-white border-none text-base lg:text-lg font-bold hover:bg-[#eaa02b] transition-colors"
            >
              Post your pet
            </button>
          </div>
        </div>
      )}

      {/* Pattern Overlay - Solo en desktop */}
      <img
        src={
          isExpanded
            ? "/assets/vectors/patterns/ExtendedPattern.svg"
            : "/assets/vectors/patterns/ExtendedPattern.svg"
        }
        alt=""
        className={`hidden lg:block absolute transition-all duration-400 ${
          isExpanded
            ? "h-[890px] ml-[460px] -mt-[502px]"
            : "h-[890px] ml-[450px] -mt-[530px]"
        } z-[1]`}
      />
    </section>
  );
}

export default CreatePost;
