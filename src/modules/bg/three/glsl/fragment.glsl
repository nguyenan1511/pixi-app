uniform vec4 resolution;
uniform vec2 mouse;
uniform sampler2D mask;
uniform float time;

varying vec2 vUv;
varying vec3 vPosition;
float PI = 3.141592653589793238;


// Function to convert from HSV to RGB
vec3 hsv2rgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}


void main() {

	vec2 newUV = (vUv - vec2(0.5))*resolution.zw + vec2(0.5);
	
	vec4 masky = texture2D(mask, vUv);

	vec2 st = gl_FragCoord.xy/resolution.xy;

	// float hue = fract(time / 10.0); // animate hue over 10 seconds
    // vec3 hsv = vec3(hue, abs(sin(st.x+time)), abs(cos(st.y+time))); // full saturation and value
    // vec3 rgb = hsv2rgb(hsv);
    // gl_FragColor = vec4(rgb, 1.0);

	// vec3 color = vec3(abs(sin(st.x+time)), abs(cos(st.y+time)), 0.5 + 0.5 * sin(time));
	// color = color * 0.6 + 0.2; // Shift color range to [0.2, 0.8]
	// gl_FragColor = vec4(color, 1.0);

    vec3 color = vec3(0.5 * sin(st.x + time) + 0.5, 0.5 * cos(st.y + time) + 0.5, 0.5);
    // Shift color range to prevent full black or white
	// color = color * 0.6 + 0.2; // Shift color range to [0.2, 0.8]
    color = color * 0.8;

	float str = masky.a;
	// vec4 t = texture2D(maskymasky, newUV + str * 0.1)

    gl_FragColor = vec4(color, 1.0);
    // gl_FragColor = t


	// gl_FragColor = vec4(abs(sin(st.x+time)),abs(cos(st.y+time)),1.0,1.0);
	// gl_FragColor = vec4(vUv,0.0,0.1);
	
	gl_FragColor.a *= masky.a;
	// gl_FragColor = masky;
	// gl_FragColor = vec4(abs(sin(time)),0.0,0.0,1.0);
}