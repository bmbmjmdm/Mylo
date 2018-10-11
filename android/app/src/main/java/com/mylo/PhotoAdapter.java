package com.mylo;

import java.util.ArrayList;
import android.widget.RelativeLayout ;
import android.support.v7.widget.RecyclerView;
import com.facebook.react.bridge.ReadableArray;
import android.view.LayoutInflater;
import android.content.Context ;
import android.util.TypedValue;
import android.view.ViewGroup;
import android.graphics.drawable.Drawable;
import android.util.DisplayMetrics ;
import java.net.URL;
import java.io.InputStream;
import android.util.Log ;
import android.os.AsyncTask;

public class PhotoAdapter extends RecyclerView.Adapter<PhotoAdapter.PhotoHolder> {
    private ReadableArray mDataset;
	private Context mContext;
	private float dpWidth;
	private DisplayMetrics displayMetrics;

    // photoholders hold relative layouts which get reused as the user scrolls, rather than creating new ones 
    public static class PhotoHolder extends RecyclerView.ViewHolder {
        
        public RelativeLayout mRLayout;
        public PhotoHolder(RelativeLayout v) {
            super(v);
            mRLayout = v;
        }
    }

    // initialize the adapter, holding onto info reused later on 
    public PhotoAdapter(ReadableArray myDataset, Context x) {
        mDataset = myDataset;
		mContext = x;
		
		displayMetrics = mContext.getResources().getDisplayMetrics();   
		dpWidth = displayMetrics.widthPixels / displayMetrics.density;
    }

    // Create new views (invoked by the layout manager)
    @Override
    public PhotoAdapter.PhotoHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        // create a new view
        RelativeLayout v = new RelativeLayout(mContext); 
		
		float scale = displayMetrics.density;
		int padding = (int) (10*scale + 0.5f);	
		
		//set the view width to be 1/3 the screen width - padding 
		RecyclerView.LayoutParams vParams = new RecyclerView.LayoutParams((int) TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_DIP, dpWidth/3-padding, displayMetrics), (int) TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_DIP, dpWidth/3-padding, displayMetrics));
		//add margin space to the view
		vParams.setMargins(padding, padding, padding, padding);
		v.setLayoutParams(vParams);	
		
        PhotoHolder vh = new PhotoHolder(v);
        return vh;
    }

    // Replace the contents of a view if it is on the screen
	// I use an AsyncTask because we make a server call to retrieve an image for each
    @Override
    public void onBindViewHolder(final PhotoHolder holder, final int position) {
		RetrieveFeedTask rft = new RetrieveFeedTask();
		rft.holdMe = holder.mRLayout;
		rft.execute(mDataset.getString(position));
    }

    // Return the size of the dataset
    @Override
    public int getItemCount() {
        return mDataset.size();
    }
}

//async task used for retrieving images 
class RetrieveFeedTask extends AsyncTask<String, Void, Drawable> {

    private Exception exception;
	public RelativeLayout holdMe; 

	//retrieve the image in a background thread 
    protected Drawable doInBackground(String... url) {
        try  {
			InputStream is = (InputStream) new URL(url[0]).getContent();
			Drawable d = Drawable.createFromStream(is, "src");
			return d;
		} 
				
		catch (Exception e) {
			//do nothing
			return null;
		}
    }

	//we ste the background here because it's back on the main thread, where Android likes to do its rendering
     protected void onPostExecute(Drawable result) {
		if(result != null){
			holdMe.setBackground(result);
		}
     }
 }