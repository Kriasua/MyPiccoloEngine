#version 310 es

#extension GL_GOOGLE_include_directive : enable

#include "constants.h"

layout(input_attachment_index = 0, set = 0, binding = 0) uniform highp subpassInput in_color;

layout(set = 0, binding = 1) uniform sampler2D color_grading_lut_texture_sampler;

layout(location = 0) out highp vec4 out_color;

void main()
{
    highp ivec2 lut_tex_size = textureSize(color_grading_lut_texture_sampler, 0);
    highp float _COLORS      = float(lut_tex_size.y);
    highp float cellDistance = 1.0 / _COLORS;
    highp vec4 color       = subpassLoad(in_color).rgba;
    highp float blue_coord = color.b * (_COLORS-1.0);
    highp float blur_lerp = fract(blue_coord);
    highp float frontslice = floor(blue_coord);
    highp float backslice = ceil(blue_coord);
    highp vec2 UV1;
    highp vec2 UV2;
    UV1.y = color.g;
    UV2.y = color.g;
    
    UV1.x = (frontslice +color.r) * cellDistance;
    UV2.x = (backslice + color.r) * cellDistance;
    
    highp vec4 color1 = texture(color_grading_lut_texture_sampler,UV1);
    highp vec4 color2 = texture(color_grading_lut_texture_sampler,UV2);
    
    out_color = mix(color1,color2,blur_lerp);
}
