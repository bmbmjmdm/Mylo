package com.mylo;

import android.support.v7.widget.RecyclerView;
import android.support.v7.widget.GridLayoutManager;
import com.facebook.react.bridge.ReadableArray;
import android.content.Context ;

//LazyView is just a RecyclerView with a few properties pre-set in setSource
public class LazyView extends RecyclerView {
    private boolean scrollable = true;

    public LazyView(Context context) {
        super(context);
    }

    public void setScrollingEnabled(boolean scrollable) {
        this.scrollable = scrollable;
    }

    public boolean isScrollable() {
        return scrollable;
    }
	
	//here I setup the GridLayoutManager to be vertical, 3 columns, and fixed in size
	//I also create the PhotoAdapter which will be in charge of the smaller views that make up this LazyView 
	public void setSource(ReadableArray sources){
		Context x = this.getContext();
		GridLayoutManager grid = new GridLayoutManager(x, sources.size());
		grid.setSpanCount(3);
		grid.setOrientation(GridLayoutManager.VERTICAL);
		this.setLayoutManager(grid);
		this.setAdapter(new PhotoAdapter(sources, x));
		this.setHasFixedSize(true);
	}

}