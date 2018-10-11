package com.mylo;

import java.util.List;
import java.util.Arrays;
import com.facebook.react.bridge.ReactApplicationContext;
import java.util.Collections;
import com.facebook.react.uimanager.ViewManager;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.ReactPackage;

//solely an intermediate class for bridging, move on to LazyManager
public class LazyPackage implements ReactPackage {


  public LazyPackage() {
  }


  @Override    
  public List<NativeModule>
  createNativeModules(ReactApplicationContext reactContext) {
     return Collections.emptyList();
  }  

  @Override
  public List<ViewManager>
  createViewManagers(ReactApplicationContext reactContext) {
    return Arrays.<ViewManager>asList(
      new LazyManager()
    );    
  }
}