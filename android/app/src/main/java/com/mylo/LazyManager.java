package com.mylo;

import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import javax.annotation.Nullable;
import java.util.List;
import java.util.Arrays;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.facebook.react.bridge.ReactApplicationContext;
import android.app.Activity;

//an intermediate class for managing our bridged class LazyView 
public class LazyManager extends SimpleViewManager<LazyView> {

	public static final String REACT_CLASS = "LazyView";

	public LazyManager(){
		super();
	}
	@Override
	public String getName() {
		return REACT_CLASS;
	}
  
	@Override
	public LazyView createViewInstance(ThemedReactContext context) {
		return new LazyView(context);
	}
	
	
	//this property is set during render in the <LazyView> element, called src
	  @ReactProp(name = "src")
	public void setSrc(LazyView view, @Nullable ReadableArray sources) {
		view.setSource(sources);
	}
}