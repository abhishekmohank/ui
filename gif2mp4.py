from moviepy.editor import VideoFileClip

# Function to convert GIF to MP4
def convert_gif_to_mp4(input_gif, output_mp4):
    clip = VideoFileClip(input_gif)
    clip.write_videofile(output_mp4, codec="libx264")

# Example usage
input_gif = "images/21Savagegiff.gif"  # Replace with your GIF file path
output_mp4 = "images/21Savagegiff.mp4"  # Replace with the desired MP4 file path

convert_gif_to_mp4(input_gif, output_mp4)
