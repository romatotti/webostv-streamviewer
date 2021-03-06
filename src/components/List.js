import React from 'react';
import { withFocusable } from 'react-tv-navigation';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';

import AddListItem from './AddListItem';

const ChannelSearchItem = ({ focused, item, scroll, index }) => {
  const className = `item streamItem ${focused ? 'focused' : 'unfocused'}`;

  const thumbnailUrl = item.video_banner
    ? item.video_banner.replace('1920', '440').replace('1080', '248')
    : null;

  return (
    <Link
      to={`/stream/${item.name}`}
      className={className}
      onFocus={() => scroll(index)}
    >
      <div className='preview'>
        {thumbnailUrl ? (
          <img src={thumbnailUrl} alt='thumbnail' />
        ) : (
          <FontAwesomeIcon className='icon' icon={faQuestionCircle} />
        )}
      </div>
      <div className='titles'>
        <span className='title'>{item.display_name}</span>
        <span className='subtitle'>{item.name}</span>
        <span className='subtitle'>{item.game}</span>
      </div>
    </Link>
  );
};

const GameListItem = ({ focused, item, scroll, index }) => {
  const className = `item gameItem ${focused ? 'focused' : 'unfocused'}`;

  const boxArtUrl = item.box_art_url
    .replace('{width}', '188')
    .replace('{height}', '250');

  return (
    <Link
      to={`/game/${item.id}`}
      className={className}
      onFocus={() => scroll(index)}
    >
      <div className='preview'>
        <img src={boxArtUrl} alt='boxart' />
      </div>
      <div className='titles'>
        <span className='title'>{item.name}</span>
      </div>
    </Link>
  );
};

const GameSearchItem = ({ focused, item, scroll, index }) => {
  const className = `item gameItem ${focused ? 'focused' : 'unfocused'}`;

  const boxArtUrl = item.box.template
    .replace('{width}', '188')
    .replace('{height}', '250');

  return (
    <Link
      to={`/game/${item._id}`}
      className={className}
      onFocus={() => scroll(index)}
    >
      <div className='preview'>
        <img src={boxArtUrl} alt='boxart' />
      </div>
      <div className='titles'>
        <span className='title'>{item.name}</span>
      </div>
    </Link>
  );
};

const StreamListItem = ({ focused, item, scroll, index }) => {
  const className = `item streamItem ${focused ? 'focused' : 'unfocused'}`;

  const thumbnailUrl = item.thumbnail_url
    .replace('{width}', '440')
    .replace('{height}', '248');

  const viewerCount =
    parseInt(item.viewer_count, 10) > 1000
      ? `${(parseInt(item.viewer_count, 10) / 1000).toFixed(0)}K`
      : item.viewer_count;

  return (
    <Link
      to={`/stream/${item.user_name}`}
      className={className}
      onFocus={() => scroll(index)}
    >
      <div className='preview'>
        <img src={thumbnailUrl} alt='thumbnail' />
      </div>
      <div className='titles'>
        <span className='title'>{item.title}</span>
        <span className='subtitle'>{item.user_name}</span>
        <span className='subtitle'>
          {item.game === undefined ? '' : item.game.name}
        </span>
        <span className='subtitle'>{viewerCount} viewers</span>
      </div>
    </Link>
  );
};

const List = ({ title, hasErrored, isLoading, items, type, addMore }) => {
  if (hasErrored) {
    return <p>Sorry! There was an error loading games</p>;
  }

  if (isLoading) {
    return <p>Loading...</p>;
  }

  const scrollRef = React.createRef();
  let Item;
  let listClassName;
  let addMorePath;
  let addMoreClass;

  switch (type) {
    case 'streamList':
      Item = withFocusable(StreamListItem);
      listClassName = 'streamList';
      addMorePath = 'addStreams';
      addMoreClass = 'streamItem';
      break;
    case 'gameList':
      Item = withFocusable(GameListItem);
      listClassName = 'gameList';
      addMorePath = 'addGames';
      addMoreClass = 'gameItem';
      break;
    case 'channelSearch':
      Item = withFocusable(ChannelSearchItem);
      listClassName = 'streamList';
      break;
    case 'gameSearch':
      Item = withFocusable(GameSearchItem);
      listClassName = 'gameList';
      break;
    default:
      break;
  }

  const scrollToMiddle = (index) => {
    if (scrollRef.current) {
      const itemWidth = scrollRef.current.getElementsByClassName('item')[0]
        .offsetWidth;
      scrollRef.current.scrollLeft = index * itemWidth - 300;
    }
  };

  return (
    <div>
      <h2>{title}</h2>
      <div className={`list ${listClassName}`} ref={scrollRef}>
        {items.map((item, index) => (
          <Item
            key={`${listClassName}Item-${0 + index}`}
            focusPath={`${listClassName}Item-${index}`}
            item={item}
            scroll={scrollToMiddle}
            index={index}
          />
        ))}
        {addMore && (
          <AddListItem
            key={addMorePath}
            focusPath={addMorePath}
            itemClass={addMoreClass}
            onClick={() => addMore()}
            scroll={scrollToMiddle}
            index={items.length}
          />
        )}
      </div>
    </div>
  );
};

export default List;
